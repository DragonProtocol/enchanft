/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:55:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-12 17:49:20
 * @Description: api 接口相关的数据类型定义
 */

/* task types */

export enum TaskType {
  WHITELIST_ORIENTED = 'WHITELIST_ORIENTED',
  WHITELIST_LUCK_DRAW = 'WHITELIST_LUCK_DRAW',
}
export enum TaskStatus {
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
export type Action = {
  id: number
  name: string
  orderNum: number
  type: string
  taskId: number
  projectId: number
  communityId: number
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
  acceptedStatus: TaskStatus
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
