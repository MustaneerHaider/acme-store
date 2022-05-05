import type { GetServerSideProps, NextPage } from 'next'
import { useSelector } from 'react-redux'
import {
  selectCartItems,
  selectIsLastItem,
  selectTotal,
  setCartItems,
} from '../app/slices/cartSlice'
import CheckoutProduct from '../components/CheckoutProduct'
import Currency from 'react-currency-formatter'
import { loadStripe } from '@stripe/stripe-js'
import { useLazyQuery } from '@apollo/client'
import { GET_CART_ITEMS, GET_SESSION_ID } from '../graphql/operations'
import { getSession, useSession } from 'next-auth/react'
import client from '../lib/apollo-client'
import { Product } from '../lib/typings'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Layout from '../components/Layout'

interface Props {
  cartProds: Array<Product>
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

const Cart: NextPage<Props> = ({ cartProds }) => {
  const cartItems = useSelector(selectCartItems)
  const total = useSelector(selectTotal)
  const isLastItem = useSelector(selectIsLastItem)
  const [createCheckoutSession] = useLazyQuery(GET_SESSION_ID)
  const { data: session } = useSession()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setCartItems(cartProds))
  }, [cartProds])

  const proceedToCheckout = async () => {
    const stripe = await stripePromise

    const result = await createCheckoutSession({
      variables: {
        input: {
          items: cartItems.map(
            ({ title, price, image, description, quantity }) => ({
              title,
              image,
              price,
              description,
              quantity,
            })
          ),
          userId: session?.user.id,
        },
      },
    })
    const sessionId = result.data.checkoutSession

    await stripe?.redirectToCheckout({
      sessionId,
    })
  }

  return (
    <Layout title="Checkout" className="bg-gray-100" showFooter={false}>
      <main className="flex flex-col lg:flex-row">
        <section className="m-5 flex-grow space-y-10 rounded-md bg-white p-5 shadow-sm">
          <h1 className="border-b pb-4 font-roboto text-3xl md:text-4xl">
            {!cartItems.length ? 'Your Cart is empty' : 'Your Shopping Cart'}
          </h1>

          {!cartItems.length && !isLastItem
            ? cartProds.map((item) => (
                <CheckoutProduct key={item.id} {...item} />
              ))
            : cartItems.map((item) => (
                <CheckoutProduct key={item.id} {...item} />
              ))}
        </section>
        {cartItems.length > 0 && (
          <section className="flex flex-col bg-white p-10 shadow-sm">
            <p className="font-quick">
              Subtotal ({cartItems.length} items):{' '}
              <span className="font-semibold">
                <Currency quantity={total} currency="PKR" />
              </span>
            </p>

            <button
              role="link"
              className="btn mt-2 whitespace-nowrap"
              onClick={proceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </section>
        )}
      </main>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  const { data } = await client.query({
    query: GET_CART_ITEMS,
    variables: {
      uid: session?.user.id,
    },
    fetchPolicy: 'no-cache',
  })

  return {
    props: {
      cartProds: data.cartItems,
    },
  }
}

export default Cart
