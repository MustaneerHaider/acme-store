import { useMutation } from '@apollo/client'
import { StarIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../app/slices/cartSlice'
import { ADD_TO_CART } from '../graphql/operations'
import { Product } from '../lib/typings'
import Currency from 'react-currency-formatter'

function ProductItem({ title, price, image, description, id }: Product) {
  const [ratings] = useState<number>(Math.floor(Math.random() * 5) + 1)
  const router = useRouter()
  const dispatch = useDispatch()
  const [pushProductToCart] = useMutation(ADD_TO_CART)
  const { data: session } = useSession()

  const addItemToCart = async (product: Product) => {
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
    <div className="m-5 flex flex-col bg-white p-8 shadow-sm" key={id}>
      <Image
        src={image}
        width={320}
        height={200}
        objectFit="contain"
        onClick={() => router.push(`/product/${id}`)}
      />
      <h4 className="my-3 cursor-default font-roboto text-xl font-bold">
        {title}
      </h4>
      <div className="flex">
        {Array(ratings)
          .fill(0)
          .map((_, index) => (
            <StarIcon key={index} className="h-5 w-5 text-yellow-500" />
          ))}
      </div>
      <p className="pt-2 text-gray-700 line-clamp-2">{description}</p>
      <h3 className="pt-2 pb-5 font-quick font-semibold">
        <Currency quantity={price} currency="USD" />
      </h3>
      <button
        className="btn mt-auto"
        onClick={() =>
          addItemToCart({
            id,
            title,
            price,
            description,
            ratings,
            image,
          })
        }
      >
        Add to Cart
      </button>
    </div>
  )
}

export default ProductItem
