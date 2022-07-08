import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  fetchListForCommunityContributionRank,
  fetchListForCommunityContributionRankParams,
} from '../../services/api/community'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { CommunityContributionRankResponseItem } from '../../types/api'

export type CommunityContributionRanksItemForEntity = CommunityContributionRankResponseItem
type ProjectsState = EntityState<CommunityContributionRanksItemForEntity> & {
  loadStatus: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchListResp = {
  data: CommunityContributionRanksItemForEntity[]
  errorMsg?: string
}

// 列表信息，标准化数据为实体对象
export const communityContributionRanksEntity = createEntityAdapter<CommunityContributionRanksItemForEntity>({
  selectId: (item) => item.pubkey,
})
// 初始化列表信息
const ProjectsState: ProjectsState = communityContributionRanksEntity.getInitialState({
  loadStatus: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

export const fetchCommunityContributionRanks = createAsyncThunk<
  FetchListResp,
  fetchListForCommunityContributionRankParams,
  {
    rejectValue: FetchListResp
  }
>(
  'dashboard/fetchCommunityContributionRanks',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListForCommunityContributionRank(params)
      return { data: resp.data.data || [] }
    } catch (error: any) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue({ data: [], errorMsg: error.response.data })
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        communityContributionRanks: { loadStatus },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (loadStatus === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const communityContributionRanksSlice = createSlice({
  name: 'communityContributionRanks',
  initialState: ProjectsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityContributionRanks.pending, (state, action) => {
        console.log('fetchCommunityContributionRanks.pending', action)
        state.loadStatus = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchCommunityContributionRanks.fulfilled, (state, action) => {
        console.log('fetchCommunityContributionRanks.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.FULFILLED
        communityContributionRanksEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchCommunityContributionRanks.rejected, (state, action) => {
        console.log('fetchCommunityContributionRanks.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.REJECTED
        communityContributionRanksEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

export const { selectAll } = communityContributionRanksEntity.getSelectors(
  (state: RootState) => state.communityContributionRanks,
)
const { reducer } = communityContributionRanksSlice
export default reducer
