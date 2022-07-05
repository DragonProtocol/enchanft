/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-01 18:04:51
 * @Description: store
 */
import { configureStore } from '@reduxjs/toolkit'

import websiteReducer from 'features/website/index'
import accountReducer from 'features/user/accountSlice'
import myEnchanftedReducer from 'features/user/myEnchanftedSlice'

export const store = configureStore({
  reducer: {
    website: websiteReducer,
    account: accountReducer,
    myEnchanfted: myEnchanftedReducer,
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
