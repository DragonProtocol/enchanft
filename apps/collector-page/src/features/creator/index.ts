import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { creatorApi, saveWinnersApi } from '../../services/api/creator'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { RewardType } from '../../types/entities'

export type ScheduleInfo = {
  closeTime: string
  endTime: string
  startTime: string
  submitTime: string
}

export type TaskInfo = {
  actions: Array<string>
  endTime: string
  name: string
  startTime: string
  type: string
  winnerNum: number
}

export type Winner = {
  id: number
  avatar: string
  name: string
  pubkey: string
}

export type PickedWhiteList = {
  task_id: number
  user_id: number
}

export type CreatorState = {
  status: AsyncRequestStatus
  saveStatus: AsyncRequestStatus
  participants: number
  winners: number
  whitelistSaved: boolean
  winnerList: Array<Winner>
  pickedWhiteList: Array<PickedWhiteList>
  taskInfo: TaskInfo | null
  scheduleInfo: ScheduleInfo | null
  reward: {
    name: string
    type: RewardType
    raffled: boolean
  }
}

// 站点状态信息
const creatorState: CreatorState = {
  status: AsyncRequestStatus.IDLE,
  saveStatus: AsyncRequestStatus.IDLE,
  participants: 0,
  winners: 0,
  whitelistSaved: false,
  winnerList: [],
  pickedWhiteList: [],
  taskInfo: null,
  scheduleInfo: null,
  reward: {
    type: RewardType.WHITELIST,
    raffled: false,
    name: '',
  },
}

export const getCreatorDashboardData = createAsyncThunk('creator/dashboard', async ({ taskId }: { taskId: number }) => {
  const resp = await creatorApi({ task: taskId })
  return resp.data
})

export const saveWinnersData = createAsyncThunk(
  'creator/saveWinners',
  async ({ taskId, winners }: { taskId: number; winners: Array<number> }) => {
    const resp = await saveWinnersApi({ task: taskId, whitelist: winners })
    return resp.data
  },
)

export const creatorSlice = createSlice({
  name: 'website',
  initialState: creatorState,
  reducers: {
    some: (state) => {},
    resetData: (state) => {
      state.status = AsyncRequestStatus.FULFILLED
      state.participants = creatorState.participants
      state.winners = creatorState.winners
      state.whitelistSaved = creatorState.whitelistSaved
      state.winnerList = creatorState.winnerList
      state.scheduleInfo = creatorState.scheduleInfo
      state.taskInfo = creatorState.taskInfo
      state.reward = creatorState.reward
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCreatorDashboardData.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING
      })
      .addCase(getCreatorDashboardData.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED
        state.participants = action.payload.participants
        state.winners = action.payload.winners
        state.whitelistSaved = action.payload.whitelistSaved
        state.winnerList = action.payload.winnerList
        state.pickedWhiteList = action.payload.pickedWhiteList
        state.scheduleInfo = action.payload.scheduleInfo
        state.taskInfo = action.payload.taskInfo
        state.reward = action.payload.reward
      })
      .addCase(getCreatorDashboardData.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED
      })
      /////
      .addCase(saveWinnersData.pending, (state, action) => {
        state.saveStatus = AsyncRequestStatus.PENDING
      })
      .addCase(saveWinnersData.fulfilled, (state, action) => {
        state.saveStatus = AsyncRequestStatus.FULFILLED
        state.whitelistSaved = true
      })
      .addCase(saveWinnersData.rejected, (state, action) => {
        state.saveStatus = AsyncRequestStatus.REJECTED
      })
  },
})

const { actions, reducer } = creatorSlice
export const { resetData } = actions
export const selectCreator = (state: RootState) => state.creator
export default reducer
