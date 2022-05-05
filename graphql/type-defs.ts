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

  type CartProduct {
    id: ID!
    title: String!
    image: String!
    price: Int!
    description: String!
    quantity: Int!
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
    products: [Product!]!
    product(id: ID!): Product
    checkoutSession(input: CheckoutSessionInput!): ID!
    cartItems(userId: ID!): [CartProduct!]!
  }

  type Mutation {
    createUser(input: UserInput!): User
    createProduct(input: CreateProductInput!): Product!
    addProdToCart(userId: String!, prodId: String!): Response!
    removeProdFromCart(userId: String!, prodId: String!): Response!
    incrementProdQuantity(userId: String!, prodId: String!): Response!
    decrementProdQuantity(userId: String!, prodId: String!): Response!
  }
`

export default typeDefs
