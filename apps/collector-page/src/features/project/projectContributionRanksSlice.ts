import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  fetchListForProjectContributionRank,
  fetchListForProjectContributionRankParams,
} from '../../services/api/project'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { ProjectContributionRankResponseItem } from '../../types/api'

export type ProjectContributionRanksItemForEntity = ProjectContributionRankResponseItem
type ProjectsState = EntityState<ProjectContributionRanksItemForEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchListResp = {
  data: ProjectContributionRanksItemForEntity[]
  errorMsg?: string
}

// 列表信息，标准化数据为实体对象
export const projectContributionRanksEntity = createEntityAdapter<ProjectContributionRanksItemForEntity>({
  selectId: (item) => item.pubkey,
})
// 初始化列表信息
const ProjectsState: ProjectsState = projectContributionRanksEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

export const fetchProjectContributionRanks = createAsyncThunk<
  FetchListResp,
  fetchListForProjectContributionRankParams,
  {
    rejectValue: FetchListResp
  }
>(
  'project/fetchProjectContributionRanks',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListForProjectContributionRank(params)
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
        projectContributionRanks: { status },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const projectContributionRanksSlice = createSlice({
  name: 'projectContributionRanks',
  initialState: ProjectsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectContributionRanks.pending, (state, action) => {
        console.log('fetchProjectContributionRanks.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchProjectContributionRanks.fulfilled, (state, action) => {
        console.log('fetchProjectContributionRanks.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        projectContributionRanksEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchProjectContributionRanks.rejected, (state, action) => {
        console.log('fetchProjectContributionRanks.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        projectContributionRanksEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

export const { selectAll } = projectContributionRanksEntity.getSelectors(
  (state: RootState) => state.projectContributionRanks,
)
const { reducer } = projectContributionRanksSlice
export default reducer
