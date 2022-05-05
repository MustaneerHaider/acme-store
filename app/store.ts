import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export default store

export type RootState = ReturnType<typeof store.getState>
