/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-12 14:53:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-23 14:52:40
 * @Description: file description
 */
import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { takeTask as takeTaskRquest, verifyOneAction, verifyOneTask } from '../../services/api/task'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { Action, Task, TaskAcceptedStatus, TaskTodoCompleteStatus } from '../../types/entities'
import { fetchTaskDetail, updateTaskDetail, updateTaskDetailAction } from '../task/taskDetailSlice'
import { fetchFollowedCommunities } from './followedCommunitiesSlice'
import { fetchTodoTasks, setOne as setOneForTodoTask, updateOneAction } from './todoTasksSlice'

// create an execution queue for the verify task
export type VerifyTaskQueueEntity = Task
type VerifyTaskQueueState = EntityState<VerifyTaskQueueEntity>
export const verifyTaskQueueEntity = createEntityAdapter<VerifyTaskQueueEntity>({
  selectId: (item) => item.id,
})
const verifyTaskQueueState: VerifyTaskQueueState = verifyTaskQueueEntity.getInitialState()

// create an execution queue for the verify action
export type VerifyActionQueueEntity = Action
type VerifyActionQueueState = EntityState<VerifyActionQueueEntity>
export const verifyActionQueueEntity = createEntityAdapter<VerifyActionQueueEntity>({
  selectId: (item) => item.id,
})
const verifyActionQueueState: VerifyActionQueueState = verifyActionQueueEntity.getInitialState()

// unified management of task operations
export type TaskHandle<T> = {
  params: T | null
  status: AsyncRequestStatus
  errorMsg: string
}
export type TakeTaskParams = {
  id: number
}
export type UserTaskHandlesStateType = {
  takeTask: TaskHandle<TakeTaskParams>
  verifyTask: TaskHandle<Task>
  verifyTaskQueue: VerifyTaskQueueState
  verifyAction: TaskHandle<Action>
  verifyActionQueue: VerifyActionQueueState
}
// init data
const initTaskHandlestate = {
  params: null,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
}
const initUserTaskHandlesState: UserTaskHandlesStateType = {
  takeTask: initTaskHandlestate,
  verifyTask: initTaskHandlestate,
  verifyTaskQueue: verifyTaskQueueState,
  verifyAction: initTaskHandlestate,
  verifyActionQueue: verifyActionQueueState,
}

// take task
export const takeTask = createAsyncThunk('user/taskHandles/takeTask', async (params: TakeTaskParams, { dispatch }) => {
  try {
    const resp = await takeTaskRquest(params)
    if (resp.data.code === 0) {
      const updateTask = { id: params.id, acceptedStatus: TaskAcceptedStatus.DONE, status: TaskTodoCompleteStatus.TODO }
      dispatch(updateTaskDetail(updateTask))
      dispatch(fetchTaskDetail(params.id))
      dispatch(fetchTodoTasks())
      dispatch(fetchFollowedCommunities())
    } else {
      throw new Error(resp.data.msg)
    }
    return { errorMsg: '' }
  } catch (error) {
    throw error
  }
})

// verify task
export const verifyTask = createAsyncThunk(
  'user/taskHandles/verifyTask',
  async (task: Task, { dispatch }) => {
    const { id } = task
    try {
      dispatch(addOneVerifyTaskQueue(task))
      const resp = await verifyOneTask({ id })
      if (resp.data.code === 0 && resp.data.data) {
        dispatch(updateTaskDetail(resp.data.data))
        dispatch(setOneForTodoTask(resp.data.data))
      } else {
        throw new Error(resp.data.msg)
      }
    } catch (error) {
      throw error
    } finally {
      dispatch(removeOneVerifyTaskQueue(id))
    }
  },
  {
    condition: (task: Task, { getState }) => {
      const state = getState() as RootState
      const { selectById } = verifyTaskQueueEntity.getSelectors()
      const item = selectById(state.userTaskHandles.verifyTaskQueue, task.id)
      // 如果此 task 正在 verify task 的队列中则阻止新的verify请求
      return !item
    },
  },
)

// verify action
export const verifyAction = createAsyncThunk(
  'user/taskHandles/verifyAction',
  async (action: Action, { dispatch }) => {
    const { id, taskId } = action
    try {
      dispatch(addOneVerifyActionQueue(action))
      const resp = await verifyOneAction({ id, taskId })
      if (resp.data.code === 0 && resp.data.data) {
        dispatch(updateTaskDetailAction(resp.data.data))
        dispatch(updateOneAction(resp.data.data))
      } else {
        throw new Error(resp.data.msg)
      }
    } catch (error) {
      throw error
    } finally {
      dispatch(removeOneVerifyActionQueue(id))
    }
  },
  {
    condition: (action: Action, { getState }) => {
      const state = getState() as RootState
      const { selectById } = verifyActionQueueEntity.getSelectors()
      const item = selectById(state.userTaskHandles.verifyActionQueue, action.id)
      // 如果此 action 正在 verify action 的队列中则阻止新的verify请求
      return !item
    },
  },
)

export const userTaskHandlesSlice = createSlice({
  name: 'TaskHandles',
  initialState: initUserTaskHandlesState,
  reducers: {
    addOneVerifyTaskQueue: (state, action) => {
      verifyTaskQueueEntity.addOne(state.verifyTaskQueue, action.payload)
    },
    removeOneVerifyTaskQueue: (state, action) => {
      verifyTaskQueueEntity.removeOne(state.verifyTaskQueue, action.payload)
    },
    addOneVerifyActionQueue: (state, action) => {
      verifyActionQueueEntity.addOne(state.verifyActionQueue, action.payload)
    },
    removeOneVerifyActionQueue: (state, action) => {
      verifyActionQueueEntity.removeOne(state.verifyActionQueue, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(takeTask.pending, (state, action) => {
        console.log('takeTask pending', action)
        state.takeTask.params = action.meta.arg
        state.takeTask.status = AsyncRequestStatus.PENDING
        state.takeTask.errorMsg = ''
      })
      .addCase(takeTask.fulfilled, (state, action) => {
        console.log('takeTask fulfilled', action)
        state.takeTask.params = null
        state.takeTask.status = AsyncRequestStatus.FULFILLED
        state.takeTask.errorMsg = ''
        toast.success('take task success')
      })
      .addCase(takeTask.rejected, (state, action) => {
        console.log('takeTask rejected', action)
        state.takeTask.params = null
        state.takeTask.status = AsyncRequestStatus.REJECTED
        state.takeTask.errorMsg = action.error.message || ''
        toast.error(action.error.message)
      })
      .addCase(verifyTask.pending, (state, action) => {
        console.log('verifyTask pending', action)
        state.verifyTask.params = action.meta.arg
        state.verifyTask.status = AsyncRequestStatus.PENDING
        state.verifyTask.errorMsg = ''
      })
      .addCase(verifyTask.fulfilled, (state, action) => {
        console.log('verifyTask fulfilled', action)
        state.verifyTask.params = null
        state.verifyTask.status = AsyncRequestStatus.FULFILLED
        state.verifyTask.errorMsg = ''
        toast.success('verifyTask task success')
      })
      .addCase(verifyTask.rejected, (state, action) => {
        console.log('verifyTask rejected', action)
        state.verifyTask.params = null
        state.verifyTask.status = AsyncRequestStatus.REJECTED
        state.verifyTask.errorMsg = action.error.message || ''
        toast.error(action.error.message)
      })
      .addCase(verifyAction.pending, (state, action) => {
        console.log('verifyAction pending', action)
        state.verifyAction.params = action.meta.arg
        state.verifyAction.status = AsyncRequestStatus.PENDING
        state.verifyAction.errorMsg = ''
      })
      .addCase(verifyAction.fulfilled, (state, action) => {
        console.log('verifyAction fulfilled', action)
        state.verifyAction.params = null
        state.verifyAction.status = AsyncRequestStatus.FULFILLED
        state.verifyAction.errorMsg = ''
        toast.success('verify action success')
      })
      .addCase(verifyAction.rejected, (state, action) => {
        console.log('verifyAction rejected', action)
        state.verifyAction.params = null
        state.verifyAction.status = AsyncRequestStatus.REJECTED
        state.verifyAction.errorMsg = action.error.message || ''
        toast.error(action.error.message)
      })
  },
})

export const selectUserTaskHandlesState = (state: RootState) => state.userTaskHandles

export const {
  selectAll: selectAllVerifyTaskQueue,
  selectIds: selectIdsVerifyTaskQueue,
  selectById: selectByIdVerifyTaskQueue,
} = verifyTaskQueueEntity.getSelectors((state: RootState) => state.userTaskHandles.verifyTaskQueue)

export const {
  selectAll: selectAllVerifyActionQueue,
  selectIds: selectIdsVerifyActionQueue,
  selectById: selectByIdVerifyActionQueue,
} = verifyActionQueueEntity.getSelectors((state: RootState) => state.userTaskHandles.verifyActionQueue)

const { actions, reducer } = userTaskHandlesSlice
const { addOneVerifyTaskQueue, removeOneVerifyTaskQueue, addOneVerifyActionQueue, removeOneVerifyActionQueue } = actions

export default reducer
