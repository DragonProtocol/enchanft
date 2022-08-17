/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:55:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-15 14:01:18
 * @Description: api 接口类型定义（多是组装entities type 为 response type）
 */

import {
  Action,
  Community,
  ContributionRank,
  Project,
  ProjectStatus,
  Reward,
  Roadmap,
  Task,
  TaskAcceptedStatus,
  TaskTodoCompleteStatus,
  Team,
  User,
  Whitelist,
} from './entities'

/** explore api */

// explore task
export enum ExploreTaskSortBy {
  NEW = 'NEW',
  HOT = 'HOT',
}
export type ExploreSearchTasksRequestParams = {
  orderType?: ExploreTaskSortBy
  keywords?: string
}
export type ExploreSearchTaskItem = Task & {
  winnerNum: number
  acceptedStatus: TaskAcceptedStatus
  actions: Action[]
  project: Project
  reward?: Reward
}
export type ExploreRecommendTaskItem = Task & {
  winnerNum: number
  acceptedStatus: TaskAcceptedStatus
  actions: Action[]
  project: Project
  reward?: Reward
}

// explore project
export type TaskItem = Task & {
  winnerNum: number
  acceptedStatus: TaskAcceptedStatus
  actions: Action[]
}
export type ExploreSearchProjectsRequestParams = {
  status?: ProjectStatus | ''
  keywords?: string
}
export type ExploreSearchProjectItem = Project & {
  community: Community
  tasks: TaskItem[]
}

export type ExploreRecommendProjectItem = Project & {
  community: Community
  tasks: TaskItem[]
}

// project detail
export type ProjectDetailTaskItem = Task & {
  winnerNum: number
  acceptedStatus: TaskAcceptedStatus
  actions: Action[]
  reward?: Reward
}
export type ProjectDetailResponse = Project & {
  tasks: ProjectDetailTaskItem[]
  teamMembers: Team[]
  roadmap: Roadmap[]
  whitelists: Whitelist[]
  community: Community
}

/** community api */
export type CommunityDetailBasicInfo = Community & {
  communityFollowerNum: number
}
export type CommunityCollectionProjectItem = Project & {
  tasks: TaskItem[]
  teamMembers: Team[]
  roadmap: Roadmap[]
  whitelists: Whitelist[]
}

export type CommunityCollectionResponse = {
  community: CommunityDetailBasicInfo
  projects: CommunityCollectionProjectItem[]
}

export type CommunityBasicInfoResponse = Community

export type CommunityContributionRankItem = ContributionRank
export type CommunityContributionRankResponse = CommunityContributionRankItem[]

export type FollowedCommunityItem = Community & {
  memberNums: number
  contribution: number
  project: Project
}
export type FollowedCommunitiesResponse = FollowedCommunityItem[]

/** contribution */
export type ContributionRanksResponse = ContributionRank[]
export type UserContributionResponse = ContributionRank

/** todo task api */
export enum UserActionStatus {
  TODO = 'TODO',
  DONE = 'DONE',
}

export type TodoTaskActionItem = Action & {
  status: UserActionStatus
  progress: string
}

export type TodoTaskItem = Task & {
  status: TaskTodoCompleteStatus
  actions: TodoTaskActionItem[]
  project: Project
  whitelist: Whitelist
}

export type TodoTaskResponse = TodoTaskItem[]

/** task detail api */
export type TaskDetailResponse = Task & {
  winnerNum: number
  acceptedStatus: TaskAcceptedStatus
  actions: TodoTaskActionItem[]
  mintUrl: string
  mintStartTime: number
  status: TaskTodoCompleteStatus
  project: Project
  winnerList: User[]
  reward?: Reward
}

/** whitelist api */
export type UserWhitelistItem = {
  task: Task
  community: Community
  whitelist: Whitelist
  reward?: Reward
}
export type UserWhitelistsResponse = UserWhitelistItem[]
