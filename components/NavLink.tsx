import { NextLink } from '@mantine/next'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface Props {
  link: string
  children: ReactNode
}

function NavLink({ link, children }: Props) {
  const router = useRouter()

  const isActive = router.asPath === link

  return (
    <NextLink
      href={link}
      className={`mt-4 rounded-sm border border-black p-2 text-center 
      font-quick text-lg font-semibold hover:bg-black hover:text-white ${
        isActive && 'border-none bg-black text-white'
      }`}
    >
      {children}
    </NextLink>
  )
}

export default NavLink
