import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { fetchListForProject, fetchListForProjectParams, ProjectItemForDashboard } from '../../services/api/dashboard'

export type ProjectItemForEntity = ProjectItemForDashboard
type ProjectsState = EntityState<ProjectItemForEntity> & {
  loadStatus: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchListResp = {
  data: ProjectItemForEntity[]
  errorMsg?: string
}

// 列表信息，标准化数据为实体对象
export const dashboardProjectsEntity = createEntityAdapter<ProjectItemForEntity>({
  selectId: (item) => item.id,
})
// 初始化列表信息
const ProjectsState: ProjectsState = dashboardProjectsEntity.getInitialState({
  loadStatus: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

export const fetchProjects = createAsyncThunk<
  FetchListResp,
  fetchListForProjectParams,
  {
    rejectValue: FetchListResp
  }
>(
  'dashboard/fetchProjects',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListForProject(params)
      return { data: resp.data || [] }
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
        dashboardProjects: { loadStatus },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (loadStatus === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const dashboardProjectsSlice = createSlice({
  name: 'dashboardProjects',
  initialState: ProjectsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state, action) => {
        console.log('fetchProjects.pending', action)
        state.loadStatus = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        console.log('fetchProjects.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.FULFILLED
        dashboardProjectsEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        console.log('fetchProjects.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.REJECTED
        dashboardProjectsEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

export const { selectAll } = dashboardProjectsEntity.getSelectors((state: RootState) => state.dashboardProjects)
const { reducer } = dashboardProjectsSlice
export default reducer
