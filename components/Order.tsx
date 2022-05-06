import Image from 'next/image'
import { Order } from '../lib/typings'
import moment from 'moment-mini'
import Currency from 'react-currency-formatter'

function Order({ id, products, totalAmount, createdAt }: Order) {
  const getTotalItems = () => {
    return products.reduce((len, el) => len + el.quantity, 0)
  }

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <header className="relative flex items-center bg-gray-100 p-4">
        <p className="absolute top-1 right-2 font-quick text-xs font-semibold text-gray-700">
          Order # {id}
        </p>

        <div className="font-quick text-sm text-gray-700">
          <p className="font-semibold">ORDER PLACED</p>
          <p>{moment.unix(createdAt).format('YYYY-MM-DD')}</p>
        </div>

        <div className="ml-10 flex-1 font-quick text-sm text-gray-700">
          <p className="font-semibold">TOTAL</p>
          <p>
            <Currency quantity={totalAmount} currency="USD" />
          </p>
        </div>

        <p className="font-quick text-sm font-semibold text-blue-500">
          {getTotalItems()} items
        </p>
      </header>
      <div className="flex p-4">
        {products.map((prod) => (
          <Image
            key={prod.product.id}
            src={prod.product.image}
            alt={prod.product.id}
            width={200}
            height={150}
            objectFit="contain"
          />
        ))}
      </div>
    </div>
  )
}

export default Order
