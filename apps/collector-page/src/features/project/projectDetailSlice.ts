/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 17:08:46
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-12 18:25:29
 * @Description: file description
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchDetailByProjectSlug } from '../../services/api/project'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { ProjectDetailResponse } from '../../types/api'

export type ProjectDetailEntity = ProjectDetailResponse
type ProjectState = {
  data: ProjectDetailEntity | null
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchDetailResp = {
  data: ProjectDetailEntity | null
  errorMsg?: string
}

// 初始化数据
const initProjectState: ProjectState = {
  data: null,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
}

export const fetchProjectDetail = createAsyncThunk<
  FetchDetailResp,
  string,
  {
    rejectValue: FetchDetailResp
  }
>('project/fetchProjectDetail', async (slug, { rejectWithValue }) => {
  try {
    const resp = await fetchDetailByProjectSlug(slug)
    return { data: resp.data.data || null }
  } catch (error: any) {
    if (!error.response) {
      throw error
    }
    return rejectWithValue({ data: null, errorMsg: error.response.data })
  }
})

export const projectDetailSlice = createSlice({
  name: 'projectDetail',
  initialState: initProjectState,
  reducers: {
    updateProjectDetail: (state, action) => {
      state.data = { ...state.data, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDetail.pending, (state, action) => {
        console.log('fetchProjectDetail.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchProjectDetail.fulfilled, (state, action) => {
        console.log('fetchProjectDetail.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        state.data = action.payload.data
      })
      .addCase(fetchProjectDetail.rejected, (state, action) => {
        console.log('fetchProjectDetail.rejected', action)
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

const { actions, reducer } = projectDetailSlice
export const selectProjectDetail = (state: RootState) => state.projectDetail
export const { updateProjectDetail } = actions
export default reducer
