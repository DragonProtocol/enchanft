import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchListByUpcoming, FetchListParams } from '../../services/api/launchpad'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { ProjectItem } from '../../types/api/launchpad'

export type ProjectItemForEntity = ProjectItem
type UpcomingProjectsState = EntityState<ProjectItemForEntity> & {
  loadStatus: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchUpcomingProjectsResp = {
  data: ProjectItemForEntity[]
  errorMsg?: string
}

// 列表信息，标准化数据为实体对象
export const launchpadUpcomingProjectsEntity = createEntityAdapter<ProjectItemForEntity>({
  selectId: (item) => item.id,
})
// 初始化列表信息
const upcomingProjectsState: UpcomingProjectsState = launchpadUpcomingProjectsEntity.getInitialState({
  loadStatus: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

// 获取第一页数据使用 （需要重置列表数据时使用）
export const fetchUpcomingProjects = createAsyncThunk<
  FetchUpcomingProjectsResp,
  FetchListParams,
  {
    rejectValue: FetchUpcomingProjectsResp
  }
>(
  'launchpad/fetchUpcomingProjects',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListByUpcoming({ ...params, page: 1 })
      return { data: resp || [] }
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
        launchpadUpcomingProjects: { loadStatus },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (loadStatus === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const launchpadUpcomingProjectsSlice = createSlice({
  name: 'launchpadUpcomingProjects',
  initialState: upcomingProjectsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingProjects.pending, (state, action) => {
        console.log('fetchUpcomingProjects.pending', action)
        state.loadStatus = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchUpcomingProjects.fulfilled, (state, action) => {
        console.log('fetchUpcomingProjects.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.FULFILLED
        launchpadUpcomingProjectsEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchUpcomingProjects.rejected, (state, action) => {
        console.log('fetchUpcomingProjects.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.REJECTED
        launchpadUpcomingProjectsEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

export const { selectAll } = launchpadUpcomingProjectsEntity.getSelectors(
  (state: RootState) => state.launchpadUpcomingProjects,
)
const { reducer } = launchpadUpcomingProjectsSlice
export default reducer
