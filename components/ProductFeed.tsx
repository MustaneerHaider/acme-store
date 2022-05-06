import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFilteredProds } from '../app/slices/productsSlice'
import { Product } from '../lib/typings'
import ProductItem from './ProductItem'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/outline'

interface Props {
  products: Product[]
  totalItems: number
}

const ITEMS_PER_PAGE = 3

function ProductFeed({ products, totalItems }: Props) {
  const [activePage, setActivePage] = useState<number>(1)
  const router = useRouter()
  const filteredProducts = useSelector(selectFilteredProds)

  const handlePageChange = (direction: 'next' | 'prev') => {
    let page = activePage
    if (direction === 'next') page++
    if (direction === 'prev') page--

    setActivePage(page)
    router.push(`/?page=${page}`)
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length === 0
          ? products.map(({ id, title, image, price, description }) => {
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
            })
          : filteredProducts.map(({ id, title, image, price, description }) => {
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
      {
        <div className="flex justify-center space-x-3 pb-4">
          {activePage > 1 && (
            <button
              className="btn flex items-center"
              onClick={() => handlePageChange('prev')}
            >
              <ChevronLeftIcon className="h-6 w-6 " />
              Previous
            </button>
          )}
          {ITEMS_PER_PAGE * activePage < totalItems && (
            <button
              className="btn flex items-center"
              onClick={() => handlePageChange('next')}
            >
              <ChevronRightIcon className="h-6 w-6 " />
              Next
            </button>
          )}
        </div>
      }
    </section>
  )
}

export default ProductFeed
