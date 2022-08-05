/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 17:08:46
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-26 15:02:38
 * @Description: file description
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchDetail, createTask as createTaskApi } from '../../services/api/task'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { TaskDetailResponse } from '../../types/api'
import { State as CreateTaskState } from '../../components/business/task/create/state'

export type TaskDetailEntity = TaskDetailResponse
type TaskState = {
  data: TaskDetailEntity | null
  status: AsyncRequestStatus
  createStatus: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchDetailResp = {
  data: TaskDetailEntity | null
  errorMsg?: string
}

// 初始化数据
const initTaskState: TaskState = {
  data: null,
  status: AsyncRequestStatus.IDLE,
  createStatus: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
}

export const fetchTaskDetail = createAsyncThunk<
  FetchDetailResp,
  number,
  {
    rejectValue: FetchDetailResp
  }
>('task/fetchTaskDetail', async (id, { rejectWithValue }) => {
  try {
    const resp = await fetchDetail(id)
    return { data: resp.data.data || null }
  } catch (error: any) {
    if (!error.response) {
      throw error
    }
    return rejectWithValue({ data: null, errorMsg: error.response.data })
  }
})

export const createTask = createAsyncThunk('task/create', async (data: CreateTaskState) => {
  const resp = await createTaskApi(data)
  return resp.data
})

export const taskDetailSlice = createSlice({
  name: 'taskDetail',
  initialState: initTaskState,
  reducers: {
    updateTaskDetail: (state, action) => {
      state.data = { ...state.data, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskDetail.pending, (state, action) => {
        console.log('fetchTaskDetail.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchTaskDetail.fulfilled, (state, action) => {
        console.log('fetchTaskDetail.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        state.data = action.payload.data
      })
      .addCase(fetchTaskDetail.rejected, (state, action) => {
        console.log('fetchTaskDetail.rejected', action)
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
      /////
      .addCase(createTask.pending, (state) => {
        state.createStatus = AsyncRequestStatus.PENDING
      })
      .addCase(createTask.fulfilled, (state) => {
        state.createStatus = AsyncRequestStatus.FULFILLED
      })
      .addCase(createTask.rejected, (state) => {
        state.createStatus = AsyncRequestStatus.REJECTED
      })
  },
})

const { actions, reducer } = taskDetailSlice
export const selectTaskDetail = (state: RootState) => state.taskDetail
export const { updateTaskDetail } = actions
export default reducer
