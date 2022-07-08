/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:55:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-08 19:53:07
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
  project_id: number
  startTime: number
  endTime: number
  actions: Action[]
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
}

/** roadmap types */
export type Roadmap = {
  id: number
  status: string
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
  status: ProjectStatus
  image: string
  communityId: number
  itemTotalNum: string
  mintType: string
  mintPrice: string
  mintStartTime: number
  whitelistTotalNum: string
  publicSaleTime: number
  injectedCoins: number
  discord: string
  twitter: string
}

/** api response types */

export type CommunityCollectionResponse = {
  community: Community
  projects: Array<
    Project & {
      tasks: Task[]
      teamMembers: Team[]
      roadmap: Roadmap[]
    }
  >
}

export type CommunityContributionRankResponseItem = {
  ranking: number
  avatar: string
  userName: string
  pubkey: string
  score: number
}
