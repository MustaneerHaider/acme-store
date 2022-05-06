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
import { GET_CART_ITEMS } from '../graphql/operations'
import { getSession } from 'next-auth/react'
import client from '../lib/apollo-client'
import { Product } from '../lib/typings'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Layout from '../components/Layout'
import PayPalCheckoutButton from '../components/PayPalCheckoutButton'

interface Props {
  cartProds: Array<Product>
}

const Cart: NextPage<Props> = ({ cartProds }) => {
  const cartItems = useSelector(selectCartItems)
  const total = useSelector(selectTotal)
  const isLastItem = useSelector(selectIsLastItem)
  const dispatch = useDispatch()
  const [checkout, setCheckout] = useState<boolean>(false)

  useEffect(() => {
    dispatch(setCartItems(cartProds))
  }, [cartProds])

  const handleCheckout = async () => {
    setCheckout(true)
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
                <Currency quantity={total} currency="USD" />
              </span>
            </p>

            {!checkout ? (
              <button
                role="link"
                className="btn mt-2 whitespace-nowrap"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            ) : (
              <PayPalCheckoutButton />
            )}
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
