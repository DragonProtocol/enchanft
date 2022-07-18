import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchListForUserTodoTask, fetchOneForUserTodoTask, FetchOneParams } from '../../services/api/task'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { TodoTaskItem, TodoTaskResponse } from '../../types/api'

export type TodoTaskItemForEntity = TodoTaskItem & {
  refreshStatus?: AsyncRequestStatus
}
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
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

type refreshOneResp = {
  data: TodoTaskItem | null
  errorMsg?: string
}

export const refreshTodoTasksOne = createAsyncThunk<
  refreshOneResp,
  FetchOneParams,
  {
    rejectValue: refreshOneResp
  }
>(
  'user/todoTasks/refreshOne',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchOneForUserTodoTask(params)
      if (resp.data.code === 0 && resp.data.data) {
        return { data: resp.data.data, errorMsg: '' }
      } else {
        return rejectWithValue({
          data: null,
          errorMsg: resp.data.msg,
        })
      }
    } catch (error: any) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue({
        data: null,
        errorMsg: error.response.data,
      })
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const { selectById } = todoTasksEntity.getSelectors()
      const item = selectById(state.userTodoTasks, params.id)
      // 之前的请求正在进行中,则阻止新的请求
      if (item?.refreshStatus === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const userTodoTasksSlice = createSlice({
  name: 'UserTodoTasks',
  initialState: initTodoTasksState,
  reducers: {
    updateOne: (state, action) => {
      const one = action.payload
      todoTasksEntity.upsertOne(state, one)
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
      .addCase(refreshTodoTasksOne.pending, (state, action) => {
        console.log('refreshTodoTasksOne.pending', action)
        const { id } = action.meta.arg
        const changes = { refreshStatus: AsyncRequestStatus.PENDING }
        todoTasksEntity.updateOne(state, { id, changes })
      })
      .addCase(refreshTodoTasksOne.fulfilled, (state, action) => {
        console.log('refreshTodoTasksOne.fulfilled', action)
        const { data } = action.payload
        if (data) {
          todoTasksEntity.setOne(state, { ...data, refreshStatus: AsyncRequestStatus.FULFILLED })
        } else {
          const { id } = action.meta.arg
          const changes = { refreshStatus: AsyncRequestStatus.FULFILLED }
          todoTasksEntity.updateOne(state, { id, changes })
        }
      })
      .addCase(refreshTodoTasksOne.rejected, (state, action) => {
        console.log('refreshTodoTasksOne.rejected', action)
        const { id } = action.meta.arg
        const changes = { refreshStatus: AsyncRequestStatus.REJECTED }
        todoTasksEntity.updateOne(state, { id, changes })
      })
  },
})

const { actions, reducer } = userTodoTasksSlice
export const selectUserTodoTasksState = (state: RootState) => state.userTodoTasks
export const { selectAll } = todoTasksEntity.getSelectors((state: RootState) => state.userTodoTasks)
export const { updateOne } = actions
export default reducer
