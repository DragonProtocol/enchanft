import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { fetchListForRecommendTasks, TaskItemForDashboardRecommend } from '../../services/api/dashboard'

export type TaskItemForEntity = TaskItemForDashboardRecommend
type RecommendTasksState = EntityState<TaskItemForEntity> & {
  loadStatus: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchListResp = {
  data: TaskItemForEntity[]
  errorMsg?: string
}

// 列表信息，标准化数据为实体对象
export const dashboardRecommendTasksEntity = createEntityAdapter<TaskItemForEntity>({
  selectId: (item) => item.id,
})
// 初始化列表信息
const RecommendTasksState: RecommendTasksState = dashboardRecommendTasksEntity.getInitialState({
  loadStatus: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

export const fetchRecommendTasks = createAsyncThunk<
  FetchListResp,
  undefined,
  {
    rejectValue: FetchListResp
  }
>(
  'dashboard/fetchRecommendTasks',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListForRecommendTasks()
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
        dashboardRecommendTasks: { loadStatus },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (loadStatus === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const dashboardRecommendTasksSlice = createSlice({
  name: 'dashboardRecommendTasks',
  initialState: RecommendTasksState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendTasks.pending, (state, action) => {
        console.log('fetchRecommendTasks.pending', action)
        state.loadStatus = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchRecommendTasks.fulfilled, (state, action) => {
        console.log('fetchRecommendTasks.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.FULFILLED
        dashboardRecommendTasksEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchRecommendTasks.rejected, (state, action) => {
        console.log('fetchRecommendTasks.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.REJECTED
        dashboardRecommendTasksEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

export const { selectAll } = dashboardRecommendTasksEntity.getSelectors(
  (state: RootState) => state.dashboardRecommendTasks,
)
const { reducer } = dashboardRecommendTasksSlice
export default reducer
