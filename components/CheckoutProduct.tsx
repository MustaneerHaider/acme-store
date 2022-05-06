import Image from 'next/image'
import { Product } from '../lib/typings'
import Currency from 'react-currency-formatter'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { StarIcon } from '@heroicons/react/solid'
import { useDispatch } from 'react-redux'
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../app/slices/cartSlice'
import { useSession } from 'next-auth/react'
import { useMutation } from '@apollo/client'
import {
  DECREMENT_QUANTITY,
  INCREMENT_QUANTITY,
  REMOVE_FROM_CART,
} from '../graphql/operations'

function CheckoutProduct({
  id,
  title,
  image,
  price,
  quantity,
  description,
}: Product) {
  const dispatch = useDispatch()
  const { data: session } = useSession()
  const [popProductFromCart] = useMutation(REMOVE_FROM_CART)
  const [increaseProductQty] = useMutation(INCREMENT_QUANTITY)
  const [decreaseProductQty] = useMutation(DECREMENT_QUANTITY)

  const removeItemFromCart = async () => {
    const result = await popProductFromCart({
      variables: {
        uid: session?.user.id,
        pid: id,
      },
    })
    if (result.data) {
      dispatch(removeFromCart({ id: id! }))
    }
  }

  const incrementItemQuantity = async () => {
    const result = await increaseProductQty({
      variables: {
        uid: session?.user.id,
        pid: id,
      },
    })
    if (result.data) {
      dispatch(incrementQuantity({ id: id! }))
    }
  }

  const decrementItemQuantity = async () => {
    const result = await decreaseProductQty({
      variables: {
        uid: session?.user.id,
        pid: id,
      },
    })
    if (result.data) {
      dispatch(decrementQuantity({ id: id! }))
    }
  }

  return (
    <div className="flex grid-cols-5 flex-col space-y-4 border-b pb-4 md:grid">
      <Image src={image} height={150} width={150} objectFit="contain" />

      <div className="col-span-3 ml-2 space-y-2 ">
        <h2 className="font-roboto">{title}</h2>
        <p className="font-quick text-sm text-gray-700 line-clamp-2">
          {description}
        </p>

        <h3 className="font-quick text-sm font-semibold">
          <Currency quantity={price} currency="USD" />
        </h3>
      </div>

      <div className="my-auto flex flex-col space-y-1.5 justify-self-end">
        <div className="flex items-center justify-between rounded-lg border-2 border-gray-500 p-1">
          <button
            className="rounded-md bg-green-500 p-2 hover:bg-green-600"
            onClick={incrementItemQuantity}
          >
            <ChevronUpIcon className="h-6 text-white " />
          </button>
          <p className="font-quick text-lg font-semibold">{quantity}</p>
          <button
            className="rounded-md bg-red-500 p-2 hover:bg-red-600"
            onClick={decrementItemQuantity}
          >
            <ChevronDownIcon className="h-6 text-white " />
          </button>
        </div>

        <button
          className="rounded-md bg-red-500 p-2 font-quick text-sm text-white hover:bg-red-600"
          onClick={removeItemFromCart}
        >
          Remove from Cart
        </button>
      </div>
    </div>
  )
}

export default CheckoutProduct
