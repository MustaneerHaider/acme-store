import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import { ADD_TO_CART, GET_PRODUCT } from '../../graphql/operations'
import client from '../../lib/apollo-client'
import { Product } from '../../lib/typings'
import Currency from 'react-currency-formatter'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../app/slices/cartSlice'
import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import Layout from '../../components/Layout'

interface Props {
  product: Product
}

const Product: NextPage<Props> = ({ product }) => {
  const dispatch = useDispatch()
  const { data: session } = useSession()
  const [pushProductToCart] = useMutation(ADD_TO_CART)

  const addItemToCart = async () => {
    const result = await pushProductToCart({
      variables: {
        uid: session?.user.id,
        pid: product.id,
      },
    })
    if (result.data) {
      dispatch(addToCart({ ...product, quantity: 1 }))
    }
  }

  return (
    <Layout title={product.title}>
      <main className="mt-10">
        <section className="flex max-w-5xl flex-col items-center space-x-4 p-5 md:flex-row md:p-2 lg:mx-auto lg:space-x-10">
          <Image
            src={product.image}
            width={380}
            height={380}
            objectFit="contain"
          />

          <div className="flex max-w-md flex-col">
            <h2 className="pb-3 font-roboto text-2xl font-bold">
              {product.title}
            </h2>
            <ul className="space-y-1">
              {product.description.split('. ').map((line, index) => (
                <li
                  className="flex space-x-2 font-quick text-gray-700"
                  key={index}
                >
                  <span className="text-sm font-semibold">{index + 1}.</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <h3 className="mt-4 font-roboto font-bold">
              <Currency quantity={product.price} currency="USD" />
            </h3>

            <button className="btn mt-10" onClick={addItemToCart}>
              Add to Cart
            </button>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prodId = context.params!.pId

  let response
  let error
  try {
    response = await client.query({
      query: GET_PRODUCT,
      variables: {
        id: prodId,
      },
    })
  } catch (err) {
    error = err
  }

  if (error) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      product: response?.data.product,
    },
  }
}

export default Product
