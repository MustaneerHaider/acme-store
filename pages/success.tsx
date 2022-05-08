import { CheckCircleIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../components/Layout'

function Success() {
  const router = useRouter()

  return (
    <Layout title="Sucess" showFooter={false} className="h-screen bg-gray-100">
      <main className="mx-auto max-w-5xl">
        <div className="flex flex-col rounded-lg bg-white p-10 shadow-sm">
          <h1 className="flex items-center space-x-2">
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
            <span className="font-roboto text-3xl">
              Thank you, your order has been confirmed!
            </span>
          </h1>

          <p className="pt-4 font-quick text-sm text-gray-700">
            Thank you for shopping with us, We'll send a confirmation once your
            item has shipped, If you would like to check the status of your
            order(s) please press the link below.
          </p>

          <button
            role="link"
            className="btn mt-5"
            onClick={() => router.push('/orders')}
          >
            Go to my orders
          </button>
        </div>
      </main>
    </Layout>
  )
}

export default Success
