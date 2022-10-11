/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 15:07:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-19 19:21:49
 * @Description: file description
 */
import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchDetailByCommunityBasicInfo } from '../../services/api/community'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { CommunityBasicInfoResponse } from '../../types/api'
export type ContributionCommunityForEntity = CommunityBasicInfoResponse | null
type ContributionCommunityState = {
  data: ContributionCommunityForEntity
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchInfoResp = {
  data: ContributionCommunityForEntity
  errorMsg?: string
}

// 初始化数据
const initContributionCommunityState: ContributionCommunityState = {
  data: null,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
}

export const fetchContributionCommunityInfo = createAsyncThunk<
  FetchInfoResp,
  string,
  {
    rejectValue: FetchInfoResp
  }
>(
  'community/fetchContributionCommunityInfo',
  async (slug, { rejectWithValue }) => {
    try {
      const resp = await fetchDetailByCommunityBasicInfo(slug)
      return { data: resp.data.data || null }
    } catch (error: any) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue({ data: null, errorMsg: error.response.data })
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        contributionCommunityInfo: { status },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const contributionCommunityInfoSlice = createSlice({
  name: 'contributionCommunityInfo',
  initialState: initContributionCommunityState,
  reducers: {
    resetContributionCommunityInfo: (state) => {
      Object.assign(state, initContributionCommunityState)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContributionCommunityInfo.pending, (state, action) => {
        console.log('fetchContributionCommunityInfo.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchContributionCommunityInfo.fulfilled, (state, action) => {
        console.log('fetchContributionCommunityInfo.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        state.data = action.payload.data
      })
      .addCase(fetchContributionCommunityInfo.rejected, (state, action) => {
        console.log('fetchContributionCommunityInfo.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        state.data = null
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

const { actions, reducer } = contributionCommunityInfoSlice
export const selectContributionCommunityInfo = (state: RootState) => state.contributionCommunityInfo
export const { resetContributionCommunityInfo } = actions
export default reducer
