import { EntityState, createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { fetchListForRecommendProjects } from '../../services/api/explore'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { ExploreRecommendProjectItem } from '../../types/api'

export type ExploreRecommendProjectItemEntity = ExploreRecommendProjectItem
type ExploreRecommendProjectsState = EntityState<ExploreRecommendProjectItemEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchListThunkResp = {
  data: ExploreRecommendProjectItemEntity[]
  errorMsg?: string
}

// 列表信息数据范式化
export const exploreRecommendProjectsEntity = createEntityAdapter<ExploreRecommendProjectItemEntity>({
  selectId: (item) => item.id,
})

// 初始化列表信息
const projectsState: ExploreRecommendProjectsState = exploreRecommendProjectsEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

export const fetchExploreRecommendProjects = createAsyncThunk<
  FetchListThunkResp,
  undefined,
  {
    rejectValue: FetchListThunkResp
  }
>(
  'explore/recommendProjects',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListForRecommendProjects()
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
        exploreRecommendProjects: { status },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const exploreRecommendProjectsSlice = createSlice({
  name: 'exploreRecommendProjects',
  initialState: projectsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExploreRecommendProjects.pending, (state, action) => {
        console.log('fetchExploreRecommendProjects.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchExploreRecommendProjects.fulfilled, (state, action) => {
        console.log('fetchExploreRecommendProjects.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        exploreRecommendProjectsEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchExploreRecommendProjects.rejected, (state, action) => {
        console.log('fetchExploreRecommendProjects.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        exploreRecommendProjectsEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})
export const selectExploreRecommendProjectsState = (state: RootState) => state.exploreRecommendProjects
export const { selectAll } = exploreRecommendProjectsEntity.getSelectors(
  (state: RootState) => state.exploreRecommendProjects,
)
const { reducer } = exploreRecommendProjectsSlice
export default reducer
