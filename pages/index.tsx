import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Banner from '../components/Banner'
import ProductFeed from '../components/ProductFeed'
import { GET_ALL_PRODUCTS } from '../graphql/operations'
import client from '../lib/apollo-client'
import { Product } from '../lib/typings'
import Layout from '../components/Layout'

interface Props {
  products: Product[]
  totalPage: number
}

const Home: NextPage<Props> = ({ products, totalPage }) => {
  return (
    <Layout className="bg-gray-100">
      <main className="mx-auto max-w-screen-2xl">
        <Banner />
        <ProductFeed products={products} totalPage={totalPage} />
      </main>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const activePage = +context.query.page! || 1

  const { data } = await client.query({
    query: GET_ALL_PRODUCTS,
    fetchPolicy: 'no-cache',
    variables: {
      page: activePage,
    },
  })

  const { products } = data

  return {
    props: {
      session,
      products: products.prods,
      totalPage: products.totalPage,
    },
  }
}

export default Home
