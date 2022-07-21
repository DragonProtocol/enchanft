/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:55:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 18:59:32
 * @Description: api 接口相关的数据类型定义
 */

/** entity data types ================= */

/* task */

export enum TaskType {
  WHITELIST_ORIENTED = 'WHITELIST_ORIENTED',
  WHITELIST_LUCK_DRAW = 'WHITELIST_LUCK_DRAW',
}
export enum TaskAcceptedStatus {
  CANDO = 'CANDO',
  CANNOT = 'CANNOT',
  DONE = 'DONE',
}
export enum TaskTodoCompleteStatus {
  TODO = 'TODO',
  IN_PRGRESS = 'IN_PRGRESS',
  COMPLETED = 'COMPLETED',
  WON = 'WON',
  LOST = 'LOST',
  CLOSED = 'CLOSED',
}
export type Task = {
  id: number
  name: string
  image: string
  whitelistTotalNum: string
  type: TaskType
  projectId: number
  startTime: number
  endTime: number
  description: string
}

/** community */
export type Community = {
  id: number
  name: string
  icon: string
  website: string
  description: string
  discord: string
  twitter: string
}

/** roadmap */
export enum RoadmapStatus {
  DONE = 'DONE',
  UNDO = 'UNDO',
}

export type Roadmap = {
  id: number
  status: RoadmapStatus
  description: string
  projectId: number
}

/** action */
export enum ActionType {
  FOLLOW_TWITTER = 'FOLLOW_TWITTER',
  FOLLOW_COMMUNITY = 'FOLLOW_COMMUNITY',
  INVITE_PEOPLE = 'INVITE_PEOPLE',
  JOIN_DISCORD = 'JOIN_DISCORD',
  RETWEET = 'RETWEET',
  LIKE_TWEET = 'LIKE_TWEET',
  UPDATE_BIO_OF_TWITTER = 'UPDATE_BIO_OF_TWITTER',
  MEET_CONTRIBUTION_SCORE = 'MET_CONTRIBUTION_SCORE',
  TURN_ON_NOTIFICATION = 'TURN_ON_NOTIFICATION',
}
export type ActionData = {
  url: string
}
export type Action = {
  id: number
  name: string
  orderNum: number
  type: ActionType
  taskId: number
  projectId: number
  communityId: number
  data: ActionData
}

/** team */
export type Team = {
  id: number
  partner: string
  role: string
  avatar: string
  description: string
  projectId: number
}

/* project */

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  LIVE = 'LIVE',
  FUTURE = 'FUTURE',
}

export type Project = {
  id: number
  name: string
  description: string
  story: string
  status: ProjectStatus
  image: string
  communityId: number
  itemTotalNum: number
  mintPrice: string
  floorPrice: string
  mintStartTime: number
  whitelistTotalNum: number
  publicSaleTime: number
  publicSalePrice: string
  injectedCoins: number
  discord: string
  twitter: string
}

export type ContributionRank = {
  ranking: number
  avatar: string
  userName: string
  pubkey: string
  score: number
}

/** whitelist */
export type Whitelist = {
  id: number
  mintPrice: string
  mintStartTime: number
  mintMaxNum: number
  totalNum: number
  projectId: number
  taskId: number
}

/** api request and response types ============================ */

/** explore api */

// explore task
export enum ExploreTaskSortBy {
  NEW = 'NEW',
  HOT = 'HOT',
}
export type ExploreSearchTasksRequestParams = {
  sortBy?: ExploreTaskSortBy
  keywords?: string
}
export type ExploreSearchTaskItem = Task & {
  winnersNum: number
  acceptedStatus: TaskAcceptedStatus
  actions: Action[]
  project: Project
}
export type ExploreRecommendTaskItem = Task & {
  winnersNum: number
  acceptedStatus: TaskAcceptedStatus
  actions: Action[]
  project: Project
}

// explore project
export type TaskItem = Task & {
  winnersNum: number
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

export type CommunityContributionRankResponseItem = ContributionRank

export type FollowedCommunityItem = Community & {
  memberNums: number
  contribution: number
}
export type FollowedCommunitiesResponse = FollowedCommunityItem[]

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
  actions: TodoTaskActionItem[]
  mintUrl: string
  mintStartTime: number
  projectImage: string
  status: TaskTodoCompleteStatus
}
export type TodoTaskResponse = TodoTaskItem[]
/** task detail api */
export type TaskDetailResponse = TaskItem & {
  actions: TodoTaskActionItem[]
  mintUrl: string
  mintStartTime: number
  status: TaskTodoCompleteStatus
  project: Project
}
