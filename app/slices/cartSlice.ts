import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from '../../lib/typings'
import { RootState } from '../store'

interface CartState {
  cart: {
    items: Product[]
  }
  isLastItem: boolean
}

const initialState: CartState = {
  cart: { items: [] },
  isLastItem: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, { payload }: PayloadAction<Product[]>) {
      state.cart.items = payload
    },
    addToCart(state, { payload }: PayloadAction<Product>) {
      const prodIndex = state.cart.items.findIndex(
        (item) => item.id === payload.id
      )

      if (prodIndex >= 0) {
        state.cart.items[prodIndex].quantity!++
      } else {
        state.cart.items.push(payload)
      }
    },
    removeFromCart(state, { payload }: PayloadAction<{ id: string }>) {
      if (state.cart.items.length === 1) {
        state.isLastItem = true
      }
      state.cart.items = state.cart.items.filter(
        (item) => item.id !== payload.id
      )
    },
    incrementQuantity(state, { payload }: PayloadAction<{ id: string }>) {
      const itemIndex = state.cart.items.findIndex(
        (item) => item.id === payload.id
      )
      state.cart.items[itemIndex].quantity! += 1
    },
    decrementQuantity(state, { payload }: PayloadAction<{ id: string }>) {
      const itemIndex = state.cart.items.findIndex(
        (item) => item.id === payload.id
      )
      if (state.cart.items[itemIndex].quantity === 1) {
        state.cart.items.splice(itemIndex, 1)
      } else {
        state.cart.items[itemIndex].quantity! -= 1
      }
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  setCartItems,
} = cartSlice.actions

export const selectCartItems = (state: RootState) => state.cart.cart.items
export const selectTotal = (state: RootState) =>
  state.cart.cart.items.reduce(
    (total, { quantity, price }) => total + price * quantity!,
    0
  )
export const selectIsLastItem = (state: RootState) => state.cart.isLastItem

export default cartSlice.reducer
