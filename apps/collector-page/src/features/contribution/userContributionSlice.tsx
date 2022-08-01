/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 15:21:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-01 18:44:47
 * @Description: file description
 */
import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchOneByUserCommunityContributionRank, fetchOneByUserCommunityScore } from '../../services/api/community'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { UserContributionResponse } from '../../types/api'
export type UserContributonForEntity = number
type UserContributonState = {
  data: UserContributonForEntity
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchInfoResp = {
  data: UserContributonForEntity
  errorMsg?: string
}

// 初始化数据
const initUserContributonState: UserContributonState = {
  data: 0,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
}

export const fetchUserContributon = createAsyncThunk<
  FetchInfoResp,
  number,
  {
    rejectValue: FetchInfoResp
  }
>(
  'community/fetchUserContributon',
  async (id, { rejectWithValue }) => {
    try {
      const resp = await fetchOneByUserCommunityScore(id)
      return { data: resp.data.data || 0 }
    } catch (error: any) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue({ data: 0, errorMsg: error.response.data })
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        userCommunityContribution: { status },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const userCommunityContributionSlice = createSlice({
  name: 'userCommunityContribution',
  initialState: initUserContributonState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserContributon.pending, (state, action) => {
        console.log('fetchUserContributon.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchUserContributon.fulfilled, (state, action) => {
        console.log('fetchUserContributon.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        state.data = action.payload.data
      })
      .addCase(fetchUserContributon.rejected, (state, action) => {
        console.log('fetchUserContributon.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        state.data = 0
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

const { actions, reducer } = userCommunityContributionSlice
export const selectUserContributon = (state: RootState) => state.userCommunityContribution
export default reducer
