/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-22 11:02:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-28 14:15:41
 * @Description: redux store
 */
import { configureStore } from '@reduxjs/toolkit';

import ExploreReducer from '../features/explore/exploreSlice';
import MyNFTReducer from '../features/my/mySlice';
import launchpadUnderwayProjectsReducer from '../features/launchpad/underwaySlice';
import launchpadUpcomingProjectsReducer from '../features/launchpad/upcomingSlice';

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
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
