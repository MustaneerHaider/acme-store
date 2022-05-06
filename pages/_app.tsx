import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from '../lib/apollo-client'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import ProgressBar from '@badrap/bar-of-progress'
import { Router } from 'next/router'
import AOS from 'aos'
import { useEffect } from 'react'
import 'aos/dist/aos.css'
import { Provider as StateProvider } from 'react-redux'
import store from '../app/store'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

const progressBar = new ProgressBar({
  size: 4,
  className: 'z-50',
  color: 'white',
  delay: 100,
})

Router.events.on('routeChangeStart', progressBar.start)
Router.events.on('routeChangeComplete', progressBar.finish)
Router.events.on('routeChangeError', progressBar.finish)

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <StateProvider store={store}>
      <SessionProvider session={session}>
        <ApolloProvider client={client}>
          <Toaster position="bottom-center" />
          <PayPalScriptProvider
            options={{
              'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            }}
          >
            <Component {...pageProps} />
          </PayPalScriptProvider>
        </ApolloProvider>
      </SessionProvider>
    </StateProvider>
  )
}

export default MyApp
