/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 17:39:50
 * @Description: store
 */
import { configureStore } from '@reduxjs/toolkit'

import websiteReducer from '../features/website/index'
import accountReducer from '../features/user/accountSlice'
import myEnchanftedReducer from '../features/user/myEnchanftedSlice'

import exploreSearchTasksReducer from '../features/explore/searchTasksSlice'
import exploreSearchProjectsReducer from '../features/explore/searchProjectsSlice'
import exploreRecommendTasksReducer from '../features/explore/recommendTasksSlice'
import exploreRecommendProjectsReducer from '../features/explore/recommendProjectsSlice'
import taskDatailReducer from '../features/task/taskDetailSlice'

import communityCollectionDetailReducer from '../features/community/collectionDetailSlice'
import communityContributionRanksReducer from '../features/community/contributionRanksSlice'
import userTaskHandlesReducer from '../features/user/taskHandlesSlice'
import userTodoTasksReducer from '../features/user/todoTasksSlice'
import userFollowedCommunitiesReducer from '../features/user/followedCommunitiesSlice'
import userCommunityHandlesReducer from '../features/user/communityHandlesSlice'

export const store = configureStore({
  reducer: {
    website: websiteReducer,
    account: accountReducer,
    myEnchanfted: myEnchanftedReducer,

    exploreSearchTasks: exploreSearchTasksReducer,
    exploreSearchProjects: exploreSearchProjectsReducer,
    exploreRecommendTasks: exploreRecommendTasksReducer,
    exploreRecommendProjects: exploreRecommendProjectsReducer,
    taskDetail: taskDatailReducer,

    communityCollectionDetail: communityCollectionDetailReducer,
    communityContributionRanks: communityContributionRanksReducer,
    userTaskHandles: userTaskHandlesReducer,
    userTodoTasks: userTodoTasksReducer,
    userFollowedCommunities: userFollowedCommunitiesReducer,
    userCommunityHandles: userCommunityHandlesReducer,
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
