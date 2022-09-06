import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchListForUserTodoTask, verifyOneTask, VerifyOneTaskParams } from '../../services/api/task'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { TodoTaskActionItem, TodoTaskItem, TodoTaskResponse, UserActionStatus } from '../../types/api'
import { TaskTodoCompleteStatus } from '../../types/entities'
import { getTaskEntityForUpdateActionAfter } from '../../utils/task'

export type TodoTaskItemForEntity = TodoTaskItem
type TodoTaskListState = EntityState<TodoTaskItemForEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
export const todoTasksEntity = createEntityAdapter<TodoTaskItemForEntity>({
  selectId: (item) => item.id,
})
const initTodoTasksState: TodoTaskListState = todoTasksEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

type FetchTodoTasksResp = {
  data: TodoTaskItem[]
  errorMsg?: string
}

export const fetchTodoTasks = createAsyncThunk<
  FetchTodoTasksResp,
  undefined,
  {
    rejectValue: FetchTodoTasksResp
  }
>(
  'user/todoTasks/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListForUserTodoTask()
      return { data: resp.data.data || [] }
    } catch (error: any) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue({
        data: [],
        errorMsg: error.response.data,
      })
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        userTodoTasks: { status },
        account: { isLogin },
      } = state
      // 没有登录,则阻止请求
      if (!isLogin) {
        todoTasksEntity.removeAll(state.userTodoTasks)
        return false
      }
      // 之前的请求正在进行中,则阻止新的请求
      // if (status === AsyncRequestStatus.PENDING) {
      //   return false
      // }
      return true
    },
  },
)

export const userTodoTasksSlice = createSlice({
  name: 'UserTodoTasks',
  initialState: initTodoTasksState,
  reducers: {
    updateOne: todoTasksEntity.updateOne,
    setOne: todoTasksEntity.setOne,
    updateOneAction: (state, action: PayloadAction<TodoTaskActionItem>) => {
      const { taskId } = action.payload
      const { selectById } = todoTasksEntity.getSelectors()
      const task = selectById(state, taskId)
      if (task) {
        const newTask = getTaskEntityForUpdateActionAfter(task, action.payload) as TodoTaskItemForEntity
        todoTasksEntity.setOne(state, newTask)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodoTasks.pending, (state, action) => {
        console.log('fetchTodoTasks.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchTodoTasks.fulfilled, (state, action) => {
        console.log('fetchTodoTasks.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        // set data
        todoTasksEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchTodoTasks.rejected, (state, action) => {
        console.log('fetchTodoTasks.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        todoTasksEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

const { actions, reducer } = userTodoTasksSlice
export const selectUserTodoTasksState = (state: RootState) => state.userTodoTasks
export const { selectAll, selectById } = todoTasksEntity.getSelectors((state: RootState) => state.userTodoTasks)
export const { updateOne, setOne, updateOneAction } = actions
export default reducer
