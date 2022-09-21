import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { fetchListForUserReward } from '../../services/api/reward'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { UserRewardItem } from '../../types/api'
import { setAvatar, setName, setPubkey, setToken } from './accountSlice'

export type UserRewardForEntity = UserRewardItem
type RewardListState = EntityState<UserRewardForEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
export const userRewardsEntity = createEntityAdapter<UserRewardForEntity>({
  selectId: (item) => item.id,
})
const initTodoTasksState: RewardListState = userRewardsEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

type FetchRewardsResp = {
  data: UserRewardItem[]
  errorMsg?: string
}

export const fetchUserRewards = createAsyncThunk<
  FetchRewardsResp,
  undefined,
  {
    rejectValue: FetchRewardsResp
  }
>(
  'user/rewards/fetchList',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const resp = await fetchListForUserReward()
      const data = resp.data.data || []
      return { data }
    } catch (error: any) {
      const err: AxiosError = error as any
      if (err.response?.status === 401) {
        dispatch(setAvatar(''))
        dispatch(setName(''))
        dispatch(setToken(''))
        dispatch(setPubkey(''))
      }
      if (!error.response) {
        throw error
      }
      return rejectWithValue({
        data: [],
        errorMsg: error.response.data,
      })
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        userRewards: { status },
        account: { isLogin },
      } = state
      // 没有登录,则阻止请求
      if (!isLogin) {
        userRewardsEntity.removeAll(state.userRewards)
        return false
      }
      // 之前的请求正在进行中,则阻止新的请求
      // if (status === AsyncRequestStatus.PENDING) {
      //   return false
      // }
      return true
    },
  },
)

export const userRewardsSlice = createSlice({
  name: 'userRewards',
  initialState: initTodoTasksState,
  reducers: {
    addOne: (state, action) => {
      const one = action.payload
      userRewardsEntity.addOne(state, one)
    },
    removeOne: (state, action) => {
      const id = action.payload
      userRewardsEntity.removeOne(state, id)
    },
    updateOne: (state, action) => {
      const one = action.payload
      userRewardsEntity.upsertOne(state, one)
    },
    removeAll: (state) => {
      userRewardsEntity.removeAll(state)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRewards.pending, (state, action) => {
        console.log('fetchUserRewards.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchUserRewards.fulfilled, (state, action) => {
        console.log('fetchUserRewards.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        // set data
        userRewardsEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchUserRewards.rejected, (state, action) => {
        console.log('fetchUserRewards.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        userRewardsEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

const { actions, reducer } = userRewardsSlice
export const selectUserRewardsState = (state: RootState) => state.userRewards
export const { selectAll, selectIds } = userRewardsEntity.getSelectors((state: RootState) => state.userRewards)
export const { addOne, removeOne, updateOne, removeAll } = actions
export default reducer
