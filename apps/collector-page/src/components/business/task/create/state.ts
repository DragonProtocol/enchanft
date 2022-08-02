export enum RewardType {
  WHITELIST = 'whitelist',
  OTHERS = 'others',
}
export type State = {
  name: string
  description: string
  image: string
  type: RewardType
  raffle: boolean
  winnerNum: number
  startTime: number
  endTime: number
  actions: Array<string>
}

export const DefaultState: State = {
  name: '',
  description: '',
  image: '',
  type: RewardType.WHITELIST,
  winnerNum: 0,
  raffle: false,
  startTime: Date.now(),
  endTime: Date.now(),
  actions: [],
}
