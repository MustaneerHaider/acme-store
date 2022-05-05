import { Schema, models, model } from 'mongoose'

const orderSchema = new Schema(
  {
    stripeId: String,
    products: [
      {
        product: Object,
        quantity: Number,
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalAmount: Number,
  },
  { timestamps: true }
)

export default models.Order || model('Order', orderSchema)
