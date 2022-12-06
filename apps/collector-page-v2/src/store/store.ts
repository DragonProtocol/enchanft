/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-06 16:11:08
 * @Description: store
 */
import { configureStore } from '@reduxjs/toolkit';

import websiteReducer from '../features/website/websiteSlice';
import eventExploreList from '../features/event/eventExploreList';
import eventHandles from '../features/event/eventHandles';
import userFavoredEvents from '../features/event/userFavoredEvents';
import userCompletedEvents from '../features/event/userCompletedEvents';
import projectExploreList from '../features/project/projectExploreList';
import projectHandles from '../features/project/projectHandles';
import userFavoredProjects from '../features/project/userFavoredProjects';
import userGroupFavorites from '../features/favorite/userGroupFavorites';

export const store = configureStore({
  reducer: {
    website: websiteReducer,
    eventExploreList,
    eventHandles,
    userFavoredEvents,
    userCompletedEvents,
    projectExploreList,
    projectHandles,
    userFavoredProjects,
    userGroupFavorites,
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
