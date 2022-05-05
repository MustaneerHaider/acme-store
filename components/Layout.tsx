import type { ReactNode } from 'react'
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

interface Props {
  children: ReactNode
  title?: string
  className?: string
  showFooter?: boolean
}

const Layout = ({
  children,
  title,
  className = '',
  showFooter = true,
}: Props) => {
  return (
    <div className={className}>
      <Head>
        <title>{title || 'Acme Store'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      {children}
      {showFooter && <Footer />}
    </div>
  )
}

export default Layout
