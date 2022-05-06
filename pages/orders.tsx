import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Layout from '../components/Layout'
import { GET_ORDERS } from '../graphql/operations'
import client from '../lib/apollo-client'
import { Order as OrderItem } from '../lib/typings'
import Order from '../components/Order'

interface Props {
  orders: OrderItem[]
}

const Orders: NextPage<Props> = ({ orders }) => {
  return (
    <Layout title="Orders" showFooter={false}>
      <main className="mx-5 mt-10 max-w-7xl pb-5 lg:mx-auto">
        <section>
          <h1 className="border-b border-black pb-2 font-roboto text-3xl">
            Your Orders
          </h1>
          <h4 className="pt-2 font-quick font-semibold">
            {orders.length} Orders
          </h4>

          <div className="space-y-6 pt-8">
            {orders.map((order) => (
              <Order
                id={order.id}
                key={order.id}
                products={order.products}
                totalAmount={order.totalAmount}
                createdAt={order.createdAt}
              />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  const { data } = await client.query({
    query: GET_ORDERS,
    variables: {
      userId: session?.user.id,
    },
  })

  return {
    props: {
      orders: data.orders,
    },
  }
}

export default Orders
