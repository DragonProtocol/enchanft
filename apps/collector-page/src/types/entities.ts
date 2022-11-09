/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:55:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-31 13:54:49
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
  discordId: string
  discordInviteUrl: string
  twitterId: string
  twitterName: string
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
  DISCORD_OBTAIN_ROLE = 'DISCORD_OBTAIN_ROLE',
  RETWEET = 'RETWEET',
  QUOTE_TWEET = 'QUOTE_TWEET',
  LIKE_TWEET = 'LIKE_TWEET',
  REPLY_TWEET = 'REPLY_TWEET',
  UPDATE_BIO_OF_TWITTER = 'UPDATE_BIO_OF_TWITTER',
  MEET_CONTRIBUTION_SCORE = 'MEET_CONTRIBUTION_SCORE',
  TURN_ON_NOTIFICATION = 'TURN_ON_NOTIFICATION',
  CUSTOM = 'CUSTOM',
  NATIVE_BALANCE = 'NATIVE_BALANCE',
  NFT_BALANCE = 'NFT_BALANCE',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  ANSWER_VERIFY = 'ANSWER_VERIFY',
}
export type NftInfo = {
  name: string
  address: string
  url: string
}
export enum Chain {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
  APTOS = 'APTOS',
}
export type ActionData = {
  url?: string
  tweet_id?: string
  server_id?: string
  role?: string
  require_score?: number
  num?: number
  accounts?: string[]
  min_native_balance?: number
  nft_accounts?: NftInfo[]
  wallet_url?: string
  question?: string
  answer?: string
  lucky_draw_weight?: number
  chain?: Chain
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
export enum GradeType {
  UNOFFICIAL = 'UNOFFICIAL',
  OFFICIAL = 'OFFICIAL',
  VIP = 'VIP',
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
  publicSaleStartTime: number
  publicSalePrice: string
  injectedCoins: number
  chainId: number
  slug: string
  grade: GradeType
}

export type ContributionRank = {
  ranking: number
  avatar: string
  userName: string
  pubkey: string
  score: number
  userId: number
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
  CONTRIBUTION_TOKEN = 'CONTRIBUTION_TOKEN',
}
export type RewardData = {
  token_num?: number
}
export type Reward = {
  id: number
  name: string
  type: RewardType
  raffled: boolean
  data: RewardData
}

/** user */
export type User = {
  id: number
  name: string
  pubkey: string
  avatar: string
}

/** announcement */
export type Announcement = {
  id: number
  projectId: number
  title: string
  text: string
}
