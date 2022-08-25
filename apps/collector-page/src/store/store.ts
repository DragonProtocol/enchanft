/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-25 16:35:31
 * @Description: store
 */
import { configureStore } from '@reduxjs/toolkit'

import websiteReducer from '../features/website/index'
import accountReducer from '../features/user/accountSlice'

// project
import exploreRecommendProjectsReducer from '../features/explore/recommendProjectsSlice'
import exploreSearchProjectsReducer from '../features/explore/searchProjectsSlice'
import projectDetailReducer from '../features/project/projectDetailSlice'

// task
import exploreRecommendTasksReducer from '../features/explore/recommendTasksSlice'
import exploreSearchTasksReducer from '../features/explore/searchTasksSlice'
import taskDatailReducer from '../features/task/taskDetailSlice'

// contirbution
import contributionCommunityInfoReducer from '../features/contribution/communityInfoSlice'
import userCommunityContributionReducer from '../features/contribution/userContributionSlice'

// community
import communityCollectionDetailReducer from '../features/community/collectionDetailSlice'
import communityContributionRanksReducer from '../features/community/contributionRanksSlice'

// user
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

    exploreSearchProjects: exploreSearchProjectsReducer,
    exploreRecommendProjects: exploreRecommendProjectsReducer,
    projectDetail: projectDetailReducer,

    exploreRecommendTasks: exploreRecommendTasksReducer,
    exploreSearchTasks: exploreSearchTasksReducer,
    taskDetail: taskDatailReducer,

    contributionCommunityInfo: contributionCommunityInfoReducer,
    userCommunityContribution: userCommunityContributionReducer,

    communityCollectionDetail: communityCollectionDetailReducer,
    communityContributionRanks: communityContributionRanksReducer,

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
