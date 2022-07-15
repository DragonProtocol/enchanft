/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:55:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-14 11:16:18
 * @Description: api 接口相关的数据类型定义
 */

/* task types */

export enum TaskType {
  WHITELIST_ORIENTED = 'WHITELIST_ORIENTED',
  WHITELIST_LUCK_DRAW = 'WHITELIST_LUCK_DRAW',
}
export enum TaskAcceptedStatus {
  CANDO = 'CANDO',
  CANNOT = 'CANNOT',
  DONE = 'DONE',
}

export type Task = {
  id: number
  name: string
  whitelistTotalNum: string
  type: TaskType
  projectId: number
  startTime: number
  endTime: number
}

/** community types */
export type Community = {
  id: number
  name: string
  icon: string
  website: string
  description: string
  discord: string
  twitter: string
  communityFollowerNum: number
  isOpenNotification: boolean
}

/** roadmap types */
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

/** action types */
export enum ActionType {
  FOLLOW_TWITTER = 'FOLLOW_TWITTER',
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

/** team types */
export type Team = {
  id: number
  partner: string
  role: string
  avatar: string
  description: string
  projectId: number
}

/* project types */

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
/** whitelist types */
export type Whitelist = {
  id: number
  mintPrice: string
  mintStartTime: number
  mintMaxNum: number
  totalNum: number
  projectId: number
  taskId: number
}

/** api response types */

export type TaskItem = Task & {
  winnersNum: number
  acceptedStatus: TaskAcceptedStatus
  actions: Action[]
}

export type DashboardTaskItem = TaskItem & {
  project: Project
}

export type DashboardProjectItem = Project & {
  community: Community
  tasks: TaskItem[]
}
export type CommunityCollectionProjectItem = Project & {
  tasks: TaskItem[]
  teamMembers: Team[]
  roadmap: Roadmap[]
  whitelists: Whitelist[]
}

export type CommunityCollectionResponse = {
  community: Community
  projects: CommunityCollectionProjectItem[]
}

export type CommunityContributionRankResponseItem = ContributionRank

export enum UserActionStatus {
  TODO = 'TODO',
  DOING = 'DOING',
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
}

export type TodoTaskResponse = {
  todoList: TodoTaskItem[]
  inProgressList: TodoTaskItem[]
  completedList: TodoTaskItem[]
  wonList: TodoTaskItem[]
  lostList: TodoTaskItem[]
  closedList: TodoTaskItem[]
}
