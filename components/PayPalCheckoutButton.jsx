import { PayPalButtons } from '@paypal/react-paypal-js'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { selectCartItems } from '../app/slices/cartSlice'
import toast from 'react-hot-toast'
import { toastStyles } from '../pages/auth'
import { useMutation } from '@apollo/client'
import { CREATE_ORDER } from '../graphql/operations'

function PayPalCheckoutButton() {
  const cartItems = useSelector(selectCartItems)
  const { data: session } = useSession()
  const router = useRouter()
  const [createOrder] = useMutation(CREATE_ORDER)

  const handleApprove = async () => {
    await createOrder({
      variables: {
        uid: session?.user.id,
      },
    })
    router.push('/success')
  }

  return (
    <PayPalButtons
      className="mt-2"
      style={{
        height: 40,
        layout: 'vertical',
        tagline: false,
        color: 'gold',
        label: 'pay',
      }}
      createOrder={(_, actions) => {
        return actions.order.create({
          purchase_units: cartItems.map((item) => ({
            reference_id: item.id,
            description: item.title,
            amount: {
              value: item.price * item.quantity,
            },
          })),
        })
      }}
      onApprove={async (_, actions) => {
        const order = await actions.order?.capture()
        handleApprove()
      }}
      onError={(err) => {
        toast.error(`An error occured while processing your payment. ${err}`, {
          style: toastStyles,
          position: 'bottom-center',
          duration: 3000,
        })
      }}
      onCancel={() => {
        toast.error(`Payment was cancelled. Try again.`, {
          style: toastStyles,
          position: 'bottom-center',
          duration: 3000,
        })
      }}
    />
  )
}

export default PayPalCheckoutButton
