import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  fetchDetailForCommunityCollection,
  fetchDetailForCommunityCollectionParams,
} from '../../services/api/community'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { Community, CommunityCollectionResponse, CommunityCollectionProjectItem } from '../../types/api'
export type CommunityBasicInfoForEntity = Community
export type CommunityCollectionProjectItemForEntity = CommunityCollectionProjectItem
export type CommunityCollectionForEntity =
  | (CommunityCollectionResponse & { community: CommunityBasicInfoForEntity })
  | null
type CommunityCollectionState = {
  data: CommunityCollectionForEntity
  status: AsyncRequestStatus
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
  status: AsyncRequestStatus.IDLE,
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
        communityCollectionDetail: { status },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const communityCollectionDetailSlice = createSlice({
  name: 'communityCollectionDetail',
  initialState: initCommunityCollectionState,
  reducers: {
    updateOneForProjectTask: (state, action) => {
      const one = action.payload
      if (state.data) {
        const projects = state.data.projects.map((item) => {
          const tasks = item.tasks.map((v) => {
            if (v.id === one.id) {
              return { ...v, ...one }
            }
            return v
          })
          return { ...item, tasks }
        })
        state.data = { ...state.data, projects }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityCollectionDetail.pending, (state, action) => {
        console.log('fetchCommunityCollectionDetail.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchCommunityCollectionDetail.fulfilled, (state, action) => {
        console.log('fetchCommunityCollectionDetail.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        state.data = action.payload.data
      })
      .addCase(fetchCommunityCollectionDetail.rejected, (state, action) => {
        console.log('fetchCommunityCollectionDetail.rejected', action)
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

const { actions, reducer } = communityCollectionDetailSlice
export const selectCommunityCollectionDetail = (state: RootState) => state.communityCollectionDetail
export const { updateOneForProjectTask } = actions
export default reducer
