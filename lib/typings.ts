export interface UserInput {
  input: {
    email: string
    password: string
  }
}

export interface CheckoutSessionInput {
  input: {
    items: Product[]
    userId: string
  }
}

export interface Credentials {
  email: string
  password: string
}

export interface Product {
  id?: string
  title: string
  price: number
  image: string
  description: string
  userId?: string
  quantity?: number
  ratings?: number
}

export interface CartItem {
  productId: {
    _id: string
    title: string
    price: number
    image: string
    description: string
  }
  quantity: number
}

export interface StripeSession {
  id: string
  metadata: {
    userId: string
  }
  amount_total: number
}
