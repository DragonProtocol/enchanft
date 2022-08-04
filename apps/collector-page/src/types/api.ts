/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:55:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-04 13:01:29
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
  whitelistTotalNum: number
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
  INVITE_PEOPLE = 'INVITE_PEOPLE',
  JOIN_DISCORD = 'JOIN_DISCORD',
  RETWEET = 'RETWEET',
  LIKE_TWEET = 'LIKE_TWEET',
  UPDATE_BIO_OF_TWITTER = 'UPDATE_BIO_OF_TWITTER',
  MEET_CONTRIBUTION_SCORE = 'MEET_CONTRIBUTION_SCORE',
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
  description: string
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
  mintUrl: string
  mintStartTime: number
  whitelistTotalNum: number
  publicSaleTime: number
  publicSalePrice: string
  injectedCoins: number
  discord: string
  twitter: string
  chainId: number
  slug: string
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
  mintUrl: string
  mintPrice: string
  mintStartTime: number
  mintEndTime: number
  mintMaxNum: number
  totalNum: number
  projectId: number
  taskId: number
}

/** reward */
export enum RewardType {
  WHITELIST_ORIENTED = 'WHITELIST_ORIENTED',
  WHITELIST_LUCK_DRAW = 'WHITELIST_LUCK_DRAW',
  OTHERS = 'OTHERS',
}

export type Reward = {
  id: number
  name: string
  type: RewardType
}

/** user */
export type User = {
  id: number
  name: string
  pubkey: string
  avatar: string
}

/** api request and response types ============================ */

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
  reward: Reward
}
export type ExploreRecommendTaskItem = Task & {
  winnerNum: number
  acceptedStatus: TaskAcceptedStatus
  actions: Action[]
  project: Project
  reward: Reward
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
  reward: Reward
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
  reward: Reward
}

/** whitelist api */
export type UserWhitelistItem = Whitelist & {
  project: Project
  community: Community
}
export type UserWhitelistsResponse = UserWhitelistItem[]
