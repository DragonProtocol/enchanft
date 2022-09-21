import { EntityState, createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { fetchListForSearchTasks } from '../../services/api/explore'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { ExploreSearchTaskItem, ExploreSearchTasksRequestParams } from '../../types/api'
import { setAvatar, setName, setPubkey, setToken } from '../user/accountSlice'

export type ExploreSearchTaskItemEntity = ExploreSearchTaskItem
type ExploreSearchTasksState = EntityState<ExploreSearchTaskItemEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchListThunkResp = {
  data: ExploreSearchTaskItemEntity[]
  errorMsg?: string
}

// 列表信息数据范式化
export const exploreSearchTasksEntity = createEntityAdapter<ExploreSearchTaskItemEntity>({
  selectId: (item) => item.id,
})

// 初始化列表信息
const tasksState: ExploreSearchTasksState = exploreSearchTasksEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

export const fetchExploreSearchTasks = createAsyncThunk<
  FetchListThunkResp,
  ExploreSearchTasksRequestParams,
  {
    rejectValue: FetchListThunkResp
  }
>(
  'explore/searchTasks',
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const resp = await fetchListForSearchTasks(params)
      return { data: resp.data.data || [] }
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
      return rejectWithValue({ data: [], errorMsg: error.response.data })
    }
  },
  // {
  //   condition: (params, { getState }) => {
  //     const state = getState() as RootState
  //     const {
  //       exploreSearchTasks: { status },
  //     } = state
  //     // 之前的请求正在进行中,则阻止新的请求
  //     if (status === AsyncRequestStatus.PENDING) {
  //       return false
  //     }
  //     return true
  //   },
  // },
)

export const exploreSearchTasksSlice = createSlice({
  name: 'exploreSearchTasks',
  initialState: tasksState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExploreSearchTasks.pending, (state, action) => {
        console.log('fetchExploreSearchTasks.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchExploreSearchTasks.fulfilled, (state, action) => {
        console.log('fetchExploreSearchTasks.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        exploreSearchTasksEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchExploreSearchTasks.rejected, (state, action) => {
        console.log('fetchExploreSearchTasks.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        exploreSearchTasksEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})
export const selectExploreSearchTasksState = (state: RootState) => state.exploreSearchTasks
export const { selectAll } = exploreSearchTasksEntity.getSelectors((state: RootState) => state.exploreSearchTasks)
const { reducer } = exploreSearchTasksSlice
export default reducer
