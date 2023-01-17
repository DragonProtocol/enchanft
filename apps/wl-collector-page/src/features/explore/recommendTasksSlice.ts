import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { fetchListForRecommendTasks } from '../../services/api/explore';
import type { RootState } from '../../store/store';
import { AsyncRequestStatus } from '../../types';
import { ExploreRecommendTaskItem } from '../../types/api';

export type ExploreRecommendTaskItemEntity = ExploreRecommendTaskItem;
type ExploreRecommendTasksState =
  EntityState<ExploreRecommendTaskItemEntity> & {
    status: AsyncRequestStatus;
    errorMsg: string;
    currentRequestId: string | undefined; // 当前正在请求的id(由createAsyncThunk生成的唯一id)
  };
type FetchListThunkResp = {
  data: ExploreRecommendTaskItemEntity[];
  errorMsg?: string;
};

// 列表信息数据范式化
export const exploreRecommendTasksEntity =
  createEntityAdapter<ExploreRecommendTaskItemEntity>({
    selectId: (item) => item.id,
  });

// 初始化列表信息
const tasksState: ExploreRecommendTasksState =
  exploreRecommendTasksEntity.getInitialState({
    status: AsyncRequestStatus.IDLE,
    errorMsg: '',
    currentRequestId: undefined,
  });

export const fetchExploreRecommendTasks = createAsyncThunk<
  FetchListThunkResp,
  undefined,
  {
    rejectValue: FetchListThunkResp;
  }
>(
  'explore/recommendTasks',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListForRecommendTasks();
      return { data: resp.data.data || [] };
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue({ data: [], errorMsg: error.response.data });
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const {
        exploreRecommendTasks: { status },
      } = state;
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false;
      }
      return true;
    },
  }
);

export const exploreRecommendTasksSlice = createSlice({
  name: 'exploreRecommendTasks',
  initialState: tasksState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExploreRecommendTasks.pending, (state, action) => {
        console.log('fetchExploreRecommendTasks.pending', action);
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchExploreRecommendTasks.fulfilled, (state, action) => {
        console.log('fetchExploreRecommendTasks.fulfilled', action);
        const { requestId } = action.meta;
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (
          state.currentRequestId !== requestId ||
          state.status !== AsyncRequestStatus.PENDING
        )
          return;
        state.status = AsyncRequestStatus.FULFILLED;
        exploreRecommendTasksEntity.setAll(state, action.payload.data);
      })
      .addCase(fetchExploreRecommendTasks.rejected, (state, action) => {
        console.log('fetchExploreRecommendTasks.rejected', action);
        const { requestId } = action.meta;
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (
          state.currentRequestId !== requestId ||
          state.status !== AsyncRequestStatus.PENDING
        )
          return;
        state.status = AsyncRequestStatus.REJECTED;
        exploreRecommendTasksEntity.setAll(state, []);
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || '';
        } else {
          state.errorMsg = action.error.message || '';
        }
      });
  },
});
export const selectExploreRecommendTasksState = (state: RootState) =>
  state.exploreRecommendTasks;
export const { selectAll } = exploreRecommendTasksEntity.getSelectors(
  (state: RootState) => state.exploreRecommendTasks
);
const { reducer } = exploreRecommendTasksSlice;
export default reducer;
