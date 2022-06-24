/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-22 11:02:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-24 12:13:26
 * @FilePath: \synft-app\src\store\store.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { configureStore } from '@reduxjs/toolkit'

import ExploreReducer from '../features/explore/exploreSlice'
import MyNFTReducer from '../features/my/mySlice'
import launchpadUnderwayProjectsReducer from '../features/launchpad/underwaySlice'
import launchpadUpcomingProjectsReducer from '../features/launchpad/upcomingSlice'

export const store = configureStore({
  reducer: {
    explore: ExploreReducer,
    mynft: MyNFTReducer,
    launchpadUnderwayProjects: launchpadUnderwayProjectsReducer,
    launchpadUpcomingProjects: launchpadUpcomingProjectsReducer,
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
