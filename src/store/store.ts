import { configureStore } from '@reduxjs/toolkit'

import MyNFTReducer from '../features/my/mySlice'

export const store = configureStore({
  reducer: {
    mynft: MyNFTReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
