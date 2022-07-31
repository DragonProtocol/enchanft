/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-29 18:53:18
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
import projectDetailReducer from '../features/project/projectDetailSlice'
import projectContributionRanksReducer from '../features/project/projectContributionRanksSlice'
import taskDatailReducer from '../features/task/taskDetailSlice'

import userTaskHandlesReducer from '../features/user/taskHandlesSlice'
import userTodoTasksReducer from '../features/user/todoTasksSlice'
import userFollowedCommunitiesReducer from '../features/user/followedCommunitiesSlice'
import userWhitelistsReducer from '../features/user/userWhitelistsSlice'
import userCommunityHandlesReducer from '../features/user/communityHandlesSlice'
import creatorReducer from '../features/creator'

export const store = configureStore({
  reducer: {
    website: websiteReducer,
    account: accountReducer,
    myEnchanfted: myEnchanftedReducer,

    exploreSearchTasks: exploreSearchTasksReducer,
    exploreSearchProjects: exploreSearchProjectsReducer,
    exploreRecommendTasks: exploreRecommendTasksReducer,
    exploreRecommendProjects: exploreRecommendProjectsReducer,
    projectDetail: projectDetailReducer,
    projectContributionRanks: projectContributionRanksReducer,
    taskDetail: taskDatailReducer,

    userTaskHandles: userTaskHandlesReducer,
    userTodoTasks: userTodoTasksReducer,
    userFollowedCommunities: userFollowedCommunitiesReducer,
    userWhitelists: userWhitelistsReducer,
    userCommunityHandles: userCommunityHandlesReducer,
    creator: creatorReducer,
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
