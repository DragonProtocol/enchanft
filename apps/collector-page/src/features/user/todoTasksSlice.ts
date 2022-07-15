import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchGroupListForUserTodoTask } from '../../services/api/task'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { TodoTaskItem, TodoTaskResponse } from '../../types/api'

export type TodoTaskItemForEntity = TodoTaskItem
type TodoTaskListState = EntityState<TodoTaskItemForEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}

/** todoList */
export const todoListEntity = createEntityAdapter<TodoTaskItemForEntity>({
  selectId: (item) => item.id,
})
const todoListState: TodoTaskListState = todoListEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

/** inProgressList */
export const inProgressListEntity = createEntityAdapter<TodoTaskItemForEntity>({
  selectId: (item) => item.id,
})
const inProgressListState: TodoTaskListState = inProgressListEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

/** completedList */
export const completedListEntity = createEntityAdapter<TodoTaskItemForEntity>({
  selectId: (item) => item.id,
})
const completedListState: TodoTaskListState = completedListEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

/** wonList */
export const wonListEntity = createEntityAdapter<TodoTaskItemForEntity>({
  selectId: (item) => item.id,
})
const wonListState: TodoTaskListState = wonListEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

/** lostList */
export const lostListEntity = createEntityAdapter<TodoTaskItemForEntity>({
  selectId: (item) => item.id,
})
const lostListState: TodoTaskListState = lostListEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

/** closedList */
export const closedListEntity = createEntityAdapter<TodoTaskItemForEntity>({
  selectId: (item) => item.id,
})
const closedListState: TodoTaskListState = closedListEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

export type TodoTasksForEntity = {
  todoList: TodoTaskListState
  inProgressList: TodoTaskListState
  completedList: TodoTaskListState
  wonList: TodoTaskListState
  lostList: TodoTaskListState
  closedList: TodoTaskListState
}
type TodoTasksState = {
  data: TodoTasksForEntity
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchDetailResp = {
  data: {
    todoList: TodoTaskItem[]
    inProgressList: TodoTaskItem[]
    completedList: TodoTaskItem[]
    wonList: TodoTaskItem[]
    lostList: TodoTaskItem[]
    closedList: TodoTaskItem[]
  }
  errorMsg?: string
}
const todoTasksForEntityData = {
  todoList: todoListState,
  inProgressList: inProgressListState,
  completedList: completedListState,
  wonList: wonListState,
  lostList: lostListState,
  closedList: closedListState,
}

// 初始化数据
const initTodoTasksState: TodoTasksState = {
  data: todoTasksForEntityData,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
}

export const fetchTodoTasks = createAsyncThunk<
  FetchDetailResp,
  undefined,
  {
    rejectValue: FetchDetailResp
  }
>(
  'todolist/fetchTodoTasks',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchGroupListForUserTodoTask()
      return { data: resp.data.data || null }
    } catch (error: any) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue({
        data: { todoList: [], inProgressList: [], completedList: [], wonList: [], lostList: [], closedList: [] },
        errorMsg: error.response.data,
      })
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        userTodoTasks: { status },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const userTodoTasksSlice = createSlice({
  name: 'UserTodoTasks',
  initialState: initTodoTasksState,
  reducers: {},
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
        todoListEntity.setAll(state.data.todoList, action.payload.data.todoList)
        inProgressListEntity.setAll(state.data.inProgressList, action.payload.data.inProgressList)
        completedListEntity.setAll(state.data.completedList, action.payload.data.completedList)
        wonListEntity.setAll(state.data.wonList, action.payload.data.wonList)
        lostListEntity.setAll(state.data.lostList, action.payload.data.lostList)
        closedListEntity.setAll(state.data.closedList, action.payload.data.closedList)
      })
      .addCase(fetchTodoTasks.rejected, (state, action) => {
        console.log('fetchTodoTasks.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        state.data = todoTasksForEntityData
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

/** todoList */
export const { selectAll: selectAllForTodoList } = todoListEntity.getSelectors(
  (state: RootState) => state.userTodoTasks.data.todoList,
)

/** inProgressList */
export const { selectAll: selectAllForInProgressList } = inProgressListEntity.getSelectors(
  (state: RootState) => state.userTodoTasks.data.inProgressList,
)

/** completedList */
export const { selectAll: selectAllForCompletedList } = completedListEntity.getSelectors(
  (state: RootState) => state.userTodoTasks.data.completedList,
)

/** wonList */
export const { selectAll: selectAllForWonList } = wonListEntity.getSelectors(
  (state: RootState) => state.userTodoTasks.data.wonList,
)

/** lostList */
export const { selectAll: selectAllForLostList } = lostListEntity.getSelectors(
  (state: RootState) => state.userTodoTasks.data.lostList,
)

/** closedList */
export const { selectAll: selectAllForClosedList } = closedListEntity.getSelectors(
  (state: RootState) => state.userTodoTasks.data.closedList,
)

export default reducer
