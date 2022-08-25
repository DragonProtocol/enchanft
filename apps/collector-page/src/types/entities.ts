/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:55:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-25 14:06:44
 * @Description: 与后端entities type定义对应
 */

/* task */

export enum TaskType {
  DEFAULT = 'DEFAULT',
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
  discordId: string
  discordInviteUrl: string
  twitter: string
  twitterId: string
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
  DISCORD_INVITES_PEOPLE = 'DISCORD_INVITES_PEOPLE',
  RETWEET = 'RETWEET',
  LIKE_TWEET = 'LIKE_TWEET',
  UPDATE_BIO_OF_TWITTER = 'UPDATE_BIO_OF_TWITTER',
  MEET_CONTRIBUTION_SCORE = 'MEET_CONTRIBUTION_SCORE',
  TURN_ON_NOTIFICATION = 'TURN_ON_NOTIFICATION',
}
export type ActionData = {
  url?: string
  tweet_id?: string
  server_id?: string
  require_score?: number
  num?: number
  accounts?: string[]
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
  DEFAULT = 'DEFAULT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export enum MintStage {
  FUTURE = 'FUTURE',
  LIVE = 'LIVE',
  SOLDOUT = 'SOLDOUT',
  CLOSED = 'CLOSED',
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
  mintStage: MintStage
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
  WHITELIST = 'WHITELIST',
  OTHERS = 'OTHER',
}

export type Reward = {
  id: number
  name: string
  type: RewardType
  raffled: boolean
}

/** user */
export type User = {
  id: number
  name: string
  pubkey: string
  avatar: string
}
