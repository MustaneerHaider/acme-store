import { gql } from 'apollo-server-micro'

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    password: String!
  }

  type Product {
    id: ID!
    title: String!
    image: String!
    price: Int!
    description: String!
    userId: ID!
  }

  type OrderProduct {
    product: Product!
    quantity: Int!
  }

  type Order {
    products: [OrderProduct!]!
    userId: ID!
    totalAmount: Int!
    id: ID!
    createdAt: Int
  }

  type CartProduct {
    id: ID!
    title: String!
    image: String!
    price: Int!
    description: String!
    quantity: Int!
  }

  type ProductsResult {
    prods: [Product!]!
    totalItems: Int!
  }

  type Response {
    message: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  input CreateProductInput {
    title: String!
    image: String!
    price: Int!
    description: String!
    userId: ID!
  }

  input CartItem {
    title: String!
    image: String!
    price: Int!
    description: String!
    quantity: Int!
  }

  input CheckoutSessionInput {
    items: [CartItem!]!
    userId: ID!
  }

  type Query {
    products(page: Int): ProductsResult!
    product(id: ID!): Product
    cartItems(userId: ID!): [CartProduct!]!
    searchProducts(query: String!): [Product!]!
    orders(userId: ID!): [Order!]!
  }

  type Mutation {
    createUser(input: UserInput!): User
    createProduct(input: CreateProductInput!): Product!
    addProdToCart(userId: String!, prodId: String!): Response!
    removeProdFromCart(userId: String!, prodId: String!): Response!
    incrementProdQuantity(userId: String!, prodId: String!): Response!
    decrementProdQuantity(userId: String!, prodId: String!): Response!
    createOrder(userId: ID!): Order!
  }
`

export default typeDefs
