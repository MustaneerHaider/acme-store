import {
  CartItem,
  OrderItem,
  Product as ProductInput,
  UserInput,
} from '../lib/typings'
import { ValidationError } from 'apollo-server-micro'
import { hashPassword } from '../lib/helpers'
import connectToDB from '../lib/db'
import User from '../models/user'
import Order from '../models/order'
import Product from '../models/product'
import moment from 'moment-mini'

// connect to database inside resolvers
connectToDB()

const resolvers = {
  Query: {
    async orders(_: any, { userId }: { userId: string }) {
      const orders = await Order.find({ userId }).sort({ createdAt: -1 })
      const transformedOrders = orders.map((order) => ({
        ...order._doc,
        id: order._id.toString(),
        userId: order.userId.toString(),
        createdAt: moment(order.createdAt).unix(),
      }))
      return transformedOrders
    },
    async searchProducts(_: any, { query }: { query: string }) {
      const products = await Product.find({ $text: { $search: query } })
      return products
    },
    async products(_: any, { page = 1 }: { page: number }) {
      const ITEMS_PER_PAGE = 3
      const totalItems = await Product.find().countDocuments()
      const products = await Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
      return {
        prods: products,
        totalItems,
      }
    },
    async product(_: any, { id }: { id: string }) {
      const product = await Product.findById(id)
      return product
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
    async createOrder(_: any, { userId }: { userId: string }) {
      const user = await User.findById(userId).populate('cart.items.productId')
      const products: OrderItem[] = user.cart.items.map(
        ({ productId, quantity }: CartItem) => ({
          product: {
            id: productId._id,
            title: productId.title,
            price: productId.price,
            description: productId.description,
            image: productId.image,
          },
          quantity,
        })
      )

      const totalAmount = products.reduce(
        (total, { product, quantity }) => total + product.price * quantity,
        0
      )

      const order = await Order.create({
        userId,
        products,
        totalAmount,
      })
      await user.clearCart()

      return order
    },
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
