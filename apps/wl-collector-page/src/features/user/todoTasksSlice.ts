import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { fetchListForUserTodoTask } from '../../services/api/task';
import type { RootState } from '../../store/store';
import { AsyncRequestStatus } from '../../types';
import { TodoTaskActionItem, TodoTaskItem } from '../../types/api';
import { getTaskEntityForUpdateActionAfter } from '../../utils/task';

export type TodoTaskItemForEntity = TodoTaskItem;
type TodoTaskListState = EntityState<TodoTaskItemForEntity> & {
  status: AsyncRequestStatus;
  errorMsg: string;
  currentRequestId: string | undefined; // 当前正在请求的id(由createAsyncThunk生成的唯一id)
};
export const todoTasksEntity = createEntityAdapter<TodoTaskItemForEntity>({
  selectId: (item) => item.id,
});
const initTodoTasksState: TodoTaskListState = todoTasksEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
});

type FetchTodoTasksResp = {
  data: TodoTaskItem[];
  errorMsg?: string;
};

export const fetchTodoTasks = createAsyncThunk<
  FetchTodoTasksResp,
  undefined,
  {
    rejectValue: FetchTodoTasksResp;
  }
>('user/todoTasks/fetchList', async (params, { rejectWithValue }) => {
  try {
    const resp = await fetchListForUserTodoTask();
    return { data: resp.data.data || [] };
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue({
      data: [],
      errorMsg: error.response.data,
    });
  }
});

export const userTodoTasksSlice = createSlice({
  name: 'UserTodoTasks',
  initialState: initTodoTasksState,
  reducers: {
    updateOne: (...args) => todoTasksEntity.updateOne(...args),
    setOne: (...args) => todoTasksEntity.setOne(...args),
    removeAll: (state) => {
      todoTasksEntity.removeAll(state);
    },
    updateOneAction: (state, action: PayloadAction<TodoTaskActionItem>) => {
      const { taskId } = action.payload;
      const { selectById } = todoTasksEntity.getSelectors();
      const task = selectById(state, taskId);
      if (task) {
        const newTask = getTaskEntityForUpdateActionAfter(
          task,
          action.payload
        ) as TodoTaskItemForEntity;
        todoTasksEntity.setOne(state, newTask);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodoTasks.pending, (state, action) => {
        console.log('fetchTodoTasks.pending', action);
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchTodoTasks.fulfilled, (state, action) => {
        console.log('fetchTodoTasks.fulfilled', action);
        const { requestId } = action.meta;
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (
          state.currentRequestId !== requestId ||
          state.status !== AsyncRequestStatus.PENDING
        )
          return;
        state.status = AsyncRequestStatus.FULFILLED;
        // set data
        todoTasksEntity.setAll(state, action.payload.data);
      })
      .addCase(fetchTodoTasks.rejected, (state, action) => {
        console.log('fetchTodoTasks.rejected', action);
        const { requestId } = action.meta;
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (
          state.currentRequestId !== requestId ||
          state.status !== AsyncRequestStatus.PENDING
        )
          return;
        state.status = AsyncRequestStatus.REJECTED;
        todoTasksEntity.setAll(state, []);
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || '';
        } else {
          state.errorMsg = action.error.message || '';
        }
      });
  },
});

const { actions, reducer } = userTodoTasksSlice;
export const selectUserTodoTasksState = (state: RootState) =>
  state.userTodoTasks;
export const { selectAll, selectById } = todoTasksEntity.getSelectors(
  (state: RootState) => state.userTodoTasks
);
export const { updateOne, setOne, updateOneAction, removeAll } = actions;
export default reducer;
