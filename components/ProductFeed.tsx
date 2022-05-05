import { Pagination } from '@mantine/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Product } from '../lib/typings'
import ProductItem from './ProductItem'

interface Props {
  products: Product[]
  totalPage: number
}

function ProductFeed({ products, totalPage }: Props) {
  const [activePage, setActivePage] = useState<number>(1)
  const router = useRouter()

  const handlePageChange = (page: number) => {
    setActivePage(page)
    router.push(`/?page=${page}`)
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map(({ id, title, image, price, description }) => {
          return (
            <ProductItem
              key={id}
              id={id}
              title={title}
              price={price}
              image={image}
              description={description}
            />
          )
        })}
      </div>
      <div className="ml-auto flex justify-end p-5">
        <Pagination
          page={activePage}
          size="xl"
          total={totalPage}
          radius="xl"
          onChange={handlePageChange}
        />
      </div>
    </section>
  )
}

export default ProductFeed
