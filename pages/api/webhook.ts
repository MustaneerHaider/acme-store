import Stripe from 'stripe'
import { buffer } from 'micro'
import { NextApiRequest, NextApiResponse } from 'next'
import Order from '../../models/order'
import User from '../../models/user'
import { CartItem, StripeSession } from '../../lib/typings'

async function handleCreateOrder(session: StripeSession) {
  const user = await User.findById(session.metadata.userId).populate(
    'cart.items.productId'
  )

  const products = user.cart.items.map(({ productId, quantity }: CartItem) => ({
    product: {
      title: productId.title,
      price: productId.price,
      image: productId.image,
      description: productId.description,
    },
    quantity,
  }))

  Order.create({
    products,
    stripeId: session.id,
    userId: session.metadata.userId,
    totalAmount: session.amount_total / 100,
  }).then(() => {
    console.log(`Order ${session.id} saved to DB.`)
  })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2020-08-27',
    })

    const reqBuffer = await buffer(req)
    const payload = reqBuffer.toString()
    const sig = req.headers['stripe-signature']
    const endpointSecret = process.env.STRIPE_SIGNING_SECRET

    let event: any

    // verify that event posted came from stripe
    try {
      event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret!)
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      // fulFill the order
      return handleCreateOrder(session)
        .then(() => res.status(200).json({ received: true }))
        .catch((error) => {
          res.status(400).send(`Webhook error ${error.message}`)
        })
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}
