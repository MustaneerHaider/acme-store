import { gql } from '@apollo/client'

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
      email
    }
  }
`

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      title
    }
  }
`

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($page: Int) {
    products(page: $page) {
      prods {
        id
        title
        price
        image
        description
      }
      totalItems
    }
  }
`

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      price
      image
      description
    }
  }
`

export const ADD_TO_CART = gql`
  mutation AddToCart($uid: String!, $pid: String!) {
    addProdToCart(userId: $uid, prodId: $pid) {
      message
    }
  }
`

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($uid: String!, $pid: String!) {
    removeProdFromCart(userId: $uid, prodId: $pid) {
      message
    }
  }
`

export const INCREMENT_QUANTITY = gql`
  mutation IncrementItemQuantity($uid: String!, $pid: String!) {
    incrementProdQuantity(userId: $uid, prodId: $pid) {
      message
    }
  }
`

export const DECREMENT_QUANTITY = gql`
  mutation DecrementItemQuantity($uid: String!, $pid: String!) {
    decrementProdQuantity(userId: $uid, prodId: $pid) {
      message
    }
  }
`

export const GET_CART_ITEMS = gql`
  query GetCartItems($uid: ID!) {
    cartItems(userId: $uid) {
      id
      title
      price
      image
      description
      quantity
    }
  }
`

export const GET_FILTERED_PRODUCTS = gql`
  query GetFilteredProducts($term: String!) {
    searchProducts(query: $term) {
      id
      title
      price
      image
      description
    }
  }
`

export const CREATE_ORDER = gql`
  mutation CreateOrder($uid: ID!) {
    createOrder(userId: $uid) {
      id
      totalAmount
    }
  }
`

export const GET_ORDERS = gql`
  query GetOrders($userId: ID!) {
    orders(userId: $userId) {
      createdAt
      id
      totalAmount
      products {
        quantity
        product {
          id
          image
        }
      }
    }
  }
`
