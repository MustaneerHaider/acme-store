import {
  CartItem,
  CheckoutSessionInput,
  Product as ProductInput,
  UserInput,
} from '../lib/typings'
import { ValidationError } from 'apollo-server-micro'
import { hashPassword } from '../lib/helpers'
import connectToDB from '../lib/db'
import User from '../models/user'
import Product from '../models/product'
import Stripe from 'stripe'

// connect to database inside resolvers
connectToDB()

const resolvers = {
  Query: {
    async products(_: any, { page = 1 }: { page: number }) {
      const ITEMS_PER_PAGE = 3
      const products = await Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
      const totalItems = await Product.find().countDocuments()
      return {
        prods: products,
        totalPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      }
    },
    async product(_: any, { id }: { id: string }) {
      const product = await Product.findById(id)
      return product
    },
    async checkoutSession(_: any, { input }: CheckoutSessionInput) {
      const { items, userId } = input

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2020-08-27',
      })

      const transformedItems = items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'pkr',
          unit_amount: item.price * 100,
          product_data: {
            name: item.title,
            images: [item.image],
          },
        },
      }))

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: transformedItems,
        success_url: `${process.env.HOST}/success`,
        cancel_url: `${process.env.HOST}/checkout`,
        metadata: {
          userId,
        },
      })

      return session.id
    },
    async cartItems(_: any, { userId }: { userId: string }) {
      const user = await User.findById(userId).populate('cart.items.productId')
      return user.cart.items.map(({ productId, quantity }: CartItem) => ({
        id: productId._id,
        title: productId.title,
        price: productId.price,
        description: productId.description,
        image: productId.image,
        quantity,
      }))
    },
  },
  Mutation: {
    async createUser(_: any, { input }: UserInput) {
      const { email, password } = input

      if (!email || !email.includes('@') || !password || password.length < 6) {
        const error = new ValidationError(
          'Missing required information for signup!'
        )
        throw error
      }

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        const error = new ValidationError('Email already exists!')
        throw error
      }

      const hashedPassword = await hashPassword(password)

      const createdUser = await User.create({
        email,
        password: hashedPassword,
      })

      return createdUser
    },
    async createProduct(_: any, { input }: { input: ProductInput }) {
      const { title, image, price, description, userId } = input

      const createdProduct = await Product.create({
        title,
        image,
        price,
        description,
        userId,
      })

      return createdProduct
    },
    async addProdToCart(
      _: any,
      { prodId, userId }: { userId: string; prodId: string }
    ) {
      const user = await User.findById(userId)
      await user.addToCart(prodId)
      return { message: `Item ${prodId} added to cart.` }
    },
    async removeProdFromCart(
      _: any,
      { prodId, userId }: { userId: string; prodId: string }
    ) {
      const user = await User.findById(userId)
      await user.removeFromCart(prodId)
      return { message: `Item ${prodId} removed from cart.` }
    },
    async incrementProdQuantity(
      _: any,
      { prodId, userId }: { userId: string; prodId: string }
    ) {
      const user = await User.findById(userId)
      await user.incrementItemQty(prodId)
      return { message: `Quantity incremented.` }
    },
    async decrementProdQuantity(
      _: any,
      { prodId, userId }: { userId: string; prodId: string }
    ) {
      const user = await User.findById(userId)
      await user.decrementItemQty(prodId)
      return { message: `Quantity decremented.` }
    },
  },
}

export default resolvers
