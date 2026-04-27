import { configureStore } from '@reduxjs/toolkit'
import { trainApi } from './api/trainApi'

export const store = configureStore({
  reducer: {
    [trainApi.reducerPath]: trainApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(trainApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
