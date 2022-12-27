/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-27 14:17:06
 * @Description: store
 */
import { configureStore } from '@reduxjs/toolkit';

import websiteReducer from '../features/website/websiteSlice';
import eventExploreList from '../features/event/eventExploreList';
import eventHandles from '../features/event/eventHandles';
// eslint-disable-next-line import/no-named-as-default
import eventCreate from '../features/event/eventCreate';
import eventCompletedList from '../features/event/eventCompletedList';
import projectExploreList from '../features/project/projectExploreList';
import projectHandles from '../features/project/projectHandles';
import frensHandles from '../features/frens/frensHandles';
import userGroupFavorites from '../features/favorite/userGroupFavorites';

export const store = configureStore({
  reducer: {
    website: websiteReducer,
    eventExploreList,
    eventHandles,
    eventCreate,
    eventCompletedList,
    projectExploreList,
    projectHandles,
    userGroupFavorites,
    frensHandles,
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
