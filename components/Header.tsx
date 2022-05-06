import Logo from './Logo'
import { SearchIcon, MenuIcon } from '@heroicons/react/outline'
import { ChangeEvent, Fragment, useRef, useState } from 'react'
import { Drawer } from '@mantine/core'
import NavLink from './NavLink'
import NextLink from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems } from '../app/slices/cartSlice'
import { getFilteredProducts } from '../app/slices/productsSlice'
import { AppDispatch } from '../app/store'
import debounce from 'lodash.debounce'

function Header() {
  const [showDrawer, setShowDrawer] = useState<boolean>(false)
  const { data: session } = useSession()
  const cartItems = useSelector(selectCartItems)
  const [, setSearchQuery] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()

  const getItems = () => {
    return cartItems.reduce((len, el) => len + el.quantity!, 0) || '...'
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    dispatch(getFilteredProducts(e.target.value))
  }

  const debounceOnChange = debounce(handleSearch, 500)

  return (
    <Fragment>
      <Drawer
        size="md"
        opened={showDrawer}
        onClose={() => setShowDrawer(false)}
        padding="xl"
        position="right"
        className="flex flex-col"
      >
        {session && <NavLink link="/checkout">Cart ({getItems()})</NavLink>}
        {session && <NavLink link="/orders">Orders</NavLink>}
        {!session && <NavLink link="/auth">Authenticate</NavLink>}
        {session && session.user.isAdmin && (
          <NavLink link="/add-product">Add Product</NavLink>
        )}
        {session && (
          <button className="btn" onClick={() => signOut()}>
            Logout
          </button>
        )}
      </Drawer>
      <header className="sticky top-0 z-50 bg-black py-3 shadow-sm">
        <div className="mx-5 flex max-w-6xl items-center justify-between lg:mx-auto">
          {/* LEFT */}
          <NextLink href="/">
            <a
              className="flex cursor-pointer items-center space-x-2 text-lg"
              href="/"
            >
              <Logo className="h-10 w-10 transform rounded-full border duration-150 ease-out hover:scale-110" />
              <span className="hidden font-quick font-bold text-white md:inline-flex">
                ACME
              </span>
            </a>
          </NextLink>

          {/* SEARCH */}
          <div className="flex min-w-[220px] items-center border border-white p-2 md:min-w-[400px]">
            <input
              type="text"
              placeholder="Search Products..."
              className="flex-grow bg-transparent font-quick text-white placeholder-white outline-none"
              onChange={debounceOnChange}
            />
            <SearchIcon className="h-5 w-5 cursor-pointer text-white" />
          </div>

          {/* RIGHT */}
          <div onClick={() => setShowDrawer(true)}>
            <MenuIcon className="h-7 w-7 transform cursor-pointer text-white duration-150 ease-out hover:scale-110" />
          </div>
        </div>
      </header>
    </Fragment>
  )
}

export default Header
