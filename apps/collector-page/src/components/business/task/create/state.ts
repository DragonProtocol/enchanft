import dayjs from 'dayjs'
import { CREATE_TASK_DEFAULT_CONTRIBUTION_TOKEN, CREATE_TASK_DEFAULT_WINNER_NUM } from '../../../../constants'
import { RewardType } from '../../../../types/entities'

export { RewardType } from '../../../../types/entities'

export enum TaskType {
  WHITELIST_ORIENTED = 'Whitelist-Oriented',
  WHITELIST_LUCK_DRAW = 'Whitelist-luck-draw',
}
export enum ActionType {
  UNKNOWN = 'unknown',
  TWITTER = 'twitter',
  DISCORD = 'discord',
  NOTIFY = 'notify',
}

export enum ActionTypeMore {
  FOLLOW_TWITTER = 'FOLLOW_TWITTER',
  INVITE_PEOPLE = 'INVITE_PEOPLE',
  JOIN_DISCORD = 'JOIN_DISCORD',
  DISCORD_INVITES_PEOPLE = 'DISCORD_INVITES_PEOPLE',
  RETWEET = 'RETWEET',
  LIKE_TWEET = 'LIKE_TWEET',
  // REPLY_TWEET = 'REPLY_TWEET',
  // UPDATE_BIO_OF_TWITTER = 'UPDATE_BIO_OF_TWITTER',
  MEET_CONTRIBUTION_SCORE = 'MEET_CONTRIBUTION_SCORE',
  TURN_ON_NOTIFICATION = 'TURN_ON_NOTIFICATION',
  CUSTOM = 'CUSTOM',
}

export type Action = {
  type: ActionType
  typeMore: ActionTypeMore
  name: string
  description: string
  url?: string
  server_id?: string
  require_score?: number
  num?: number
  accounts?: string[]
  tweet_id?: string
}

export type Reward = {
  type: RewardType
  raffled: boolean
  name?: string
  token_num?: number
}

export type State = {
  projectId: number
  projectName: string
  type: TaskType
  name: string
  description: string
  image: string
  reward: Reward
  winnerNum: number
  startTime: number
  endTime: number
  actions: Array<Action>
  followTwitters: Array<string>
}

export const DefaultState: State = {
  projectId: 0,
  projectName: '',
  type: TaskType.WHITELIST_ORIENTED,
  name: '',
  description: '',
  image: '',
  reward: {
    type: RewardType.WHITELIST,
    raffled: false,
    name: '',
    token_num: CREATE_TASK_DEFAULT_CONTRIBUTION_TOKEN,
  },
  winnerNum: CREATE_TASK_DEFAULT_WINNER_NUM,
  startTime: Date.now(),
  endTime: dayjs(Date.now()).add(30, 'day').toDate().getTime(),
  actions: [],
  followTwitters: [],
}
