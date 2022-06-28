/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-24 10:45:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-28 14:14:56
 * @FilePath: \synft-app\src\features\launchpad\underwaySlice.ts
 * @Description: 正在进行的项目列表状态数据
 */
import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchListByUnderway, FetchListParams } from '../../services/api/launchpad'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { ProjectItem } from '../../types/api/launchpad'

export type ProjectItemForEntity = ProjectItem
type UnderwayProjectsState = EntityState<ProjectItemForEntity> & {
  loadStatus: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchUnderwayProjectsResp = {
  data: ProjectItemForEntity[]
  errorMsg?: string
}

// 列表信息，标准化数据为实体对象
export const launchpadUnderwayProjectsEntity = createEntityAdapter<ProjectItemForEntity>({
  selectId: (item) => item.id,
})
// 初始化列表信息
const underwayProjectsState: UnderwayProjectsState = launchpadUnderwayProjectsEntity.getInitialState({
  loadStatus: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

// 获取第一页数据使用 （需要重置列表数据时使用）
export const fetchUnderwayProjects = createAsyncThunk<
  FetchUnderwayProjectsResp,
  FetchListParams,
  {
    rejectValue: FetchUnderwayProjectsResp
  }
>(
  'launchpad/fetchUnderwayProjects',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListByUnderway({ ...params, page: 1 })
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
        launchpadUnderwayProjects: { loadStatus },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (loadStatus === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const launchpadUnderwayProjectsSlice = createSlice({
  name: 'launchpadUnderwayProjects',
  initialState: underwayProjectsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnderwayProjects.pending, (state, action) => {
        console.log('fetchUnderwayProjects.pending', action)
        state.loadStatus = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchUnderwayProjects.fulfilled, (state, action) => {
        console.log('fetchUnderwayProjects.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.FULFILLED
        launchpadUnderwayProjectsEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchUnderwayProjects.rejected, (state, action) => {
        console.log('fetchUnderwayProjects.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.loadStatus !== AsyncRequestStatus.PENDING) return
        state.loadStatus = AsyncRequestStatus.REJECTED
        launchpadUnderwayProjectsEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

export const { selectAll } = launchpadUnderwayProjectsEntity.getSelectors(
  (state: RootState) => state.launchpadUnderwayProjects,
)
const { reducer } = launchpadUnderwayProjectsSlice
export default reducer
