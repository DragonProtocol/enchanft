import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  fetchDetailForCommunityCollection,
  fetchDetailForCommunityCollectionParams,
} from '../../services/api/community'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { CommunityCollectionResponse } from '../../types/api'

export type CommunityCollectionForEntity = CommunityCollectionResponse | null
type CommunityCollectionState = {
  data: CommunityCollectionForEntity
  loadStatus: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchDetailResp = {
  data: CommunityCollectionForEntity
  errorMsg?: string
}

// 初始化数据
const initCommunityCollectionState: CommunityCollectionState = {
  data: null,
  loadStatus: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
}

export const fetchCommunityCollectionDetail = createAsyncThunk<
  FetchDetailResp,
  fetchDetailForCommunityCollectionParams,
  {
    rejectValue: FetchDetailResp
  }
>(
  'community/fetchCommunityCollectionDetail',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchDetailForCommunityCollection(params)
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
        communityCollectionDetail: { loadStatus },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (loadStatus === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const communityCollectionDetailSlice = createSlice({
  name: 'communityCollectionDetail',
  initialState: initCommunityCollectionState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityCollectionDetail.pending, (state, action) => {
        console.log('fetchCommunityCollectionDetail.pending', action)
        state.loadStatus = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchCommunityCollectionDetail.fulfilled, (state, action) => {
        console.log('fetchCommunityCollectionDetail.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.FULFILLED
        state.data = action.payload.data
      })
      .addCase(fetchCommunityCollectionDetail.rejected, (state, action) => {
        console.log('fetchCommunityCollectionDetail.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.REJECTED
        state.data = null
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

const { actions, reducer } = communityCollectionDetailSlice
export const selectCommunityCollectionDetail = (state: RootState) => state.communityCollectionDetail
export default reducer
