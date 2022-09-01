import { EntityState, createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { fetchListForSearchProjects } from '../../services/api/explore'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { ExploreSearchProjectItem, ExploreSearchProjectsRequestParams } from '../../types/api'

export type ExploreSearchProjectItemEntity = ExploreSearchProjectItem
type ExploreSearchProjectsState = EntityState<ExploreSearchProjectItemEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchListThunkResp = {
  data: ExploreSearchProjectItemEntity[]
  errorMsg?: string
}

// 列表信息数据范式化
export const exploreSearchProjectsEntity = createEntityAdapter<ExploreSearchProjectItemEntity>({
  selectId: (item) => item.id,
})

// 初始化列表信息
const projectsState: ExploreSearchProjectsState = exploreSearchProjectsEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

export const fetchExploreSearchProjects = createAsyncThunk<
  FetchListThunkResp,
  ExploreSearchProjectsRequestParams,
  {
    rejectValue: FetchListThunkResp
  }
>(
  'explore/searchProjects',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListForSearchProjects(params)
      return { data: resp.data.data || [] }
    } catch (error: any) {
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
  //       exploreSearchProjects: { status },
  //     } = state
  //     // 之前的请求正在进行中,则阻止新的请求
  //     if (status === AsyncRequestStatus.PENDING) {
  //       return false
  //     }
  //     return true
  //   },
  // },
)

export const exploreSearchProjectsSlice = createSlice({
  name: 'exploreSearchProjects',
  initialState: projectsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExploreSearchProjects.pending, (state, action) => {
        console.log('fetchExploreSearchProjects.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchExploreSearchProjects.fulfilled, (state, action) => {
        console.log('fetchExploreSearchProjects.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        exploreSearchProjectsEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchExploreSearchProjects.rejected, (state, action) => {
        console.log('fetchExploreSearchProjects.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        exploreSearchProjectsEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})
export const selectExploreSearchProjectsState = (state: RootState) => state.exploreSearchProjects
export const { selectAll } = exploreSearchProjectsEntity.getSelectors((state: RootState) => state.exploreSearchProjects)
const { reducer } = exploreSearchProjectsSlice
export default reducer
