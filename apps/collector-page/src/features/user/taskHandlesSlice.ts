/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-12 14:53:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-13 13:38:44
 * @Description: file description
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { takeTask } from '../../services/api/task'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { TaskAcceptedStatus } from '../../types/api'
import { updateOneForProjectTask } from '../community/collectionDetailSlice'
import { updateOne as updateOneForDashboardRecommendTasksSlice } from '../dashboard/recommendTasksSlice'
// 每一种操作单独存储当前的数据状态
export type TaskHandle<T> = {
  params: T | null
  status: AsyncRequestStatus
  errorMsg: string
}
export type TakeTaskParams = {
  id: number
}
const initTaskHandlestate = {
  params: null,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
}
// 将操作集合到一起，统一管理
export type UserTaskHandlesStateType = {
  take: TaskHandle<TakeTaskParams>
}
const initUserTaskHandlesState: UserTaskHandlesStateType = {
  take: initTaskHandlestate,
}
export const take = createAsyncThunk('taskHandles/take', async (params: TakeTaskParams, { dispatch }) => {
  try {
    const resp = await takeTask(params)
    if (resp.data.code === 0) {
      const updateTask = { id: params.id, acceptedStatus: TaskAcceptedStatus.DONE }
      dispatch(updateOneForDashboardRecommendTasksSlice(updateTask))
      dispatch(updateOneForProjectTask(updateTask))
    } else {
      throw new Error(resp.data.msg)
    }
    return { errorMsg: '' }
  } catch (error) {
    throw error
  }
})
export const userTaskHandlesSlice = createSlice({
  name: 'TaskHandles',
  initialState: initUserTaskHandlesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(take.pending, (state, action) => {
        console.log('take pending', action)
        state.take.params = action.meta.arg
        state.take.status = AsyncRequestStatus.PENDING
        state.take.errorMsg = ''
      })
      .addCase(take.fulfilled, (state, action) => {
        console.log('take fulfilled', action)
        state.take.params = null
        state.take.status = AsyncRequestStatus.FULFILLED
        state.take.errorMsg = ''
      })
      .addCase(take.rejected, (state, action) => {
        console.log('take rejected', action)
        state.take.params = null
        state.take.status = AsyncRequestStatus.REJECTED
        state.take.errorMsg = action.error.message || ''
      })
  },
})

export const selectTake = (state: RootState) => state.userTaskHandles.take
export const selectUserTaskHandlesState = (state: RootState) => state.userTaskHandles

const { actions, reducer } = userTaskHandlesSlice

export default reducer
