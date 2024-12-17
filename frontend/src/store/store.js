import { configureStore } from '@reduxjs/toolkit'
import { FilterReducer } from './FilterSlice'

export const store = configureStore({
  reducer: {
    "filter":FilterReducer
  },
})