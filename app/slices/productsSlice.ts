import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GET_FILTERED_PRODUCTS } from '../../graphql/operations'
import client from '../../lib/apollo-client'
import { Product } from '../../lib/typings'
import { AppDispatch, RootState } from '../store'

interface ProductsState {
  products: Product[]
}

const initialState: ProductsState = {
  products: [],
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilteredProducts(
      state,
      { payload }: PayloadAction<{ prods: Product[] }>
    ) {
      state.products = payload.prods
    },
  },
})

export const { setFilteredProducts } = productsSlice.actions

export const selectFilteredProds = (state: RootState) => state.prods.products

export default productsSlice.reducer

export const getFilteredProducts =
  (query: string) => async (dispatch: AppDispatch) => {
    const { data } = await client.query({
      query: GET_FILTERED_PRODUCTS,
      variables: {
        term: query,
      },
    })
    const filteredProducts = data.searchProducts
    dispatch(setFilteredProducts({ prods: filteredProducts }))
  }
