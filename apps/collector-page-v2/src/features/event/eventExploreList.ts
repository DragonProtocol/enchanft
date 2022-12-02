/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-02 16:34:44
 * @Description: file description
 */
import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { fetchListForEventExplore } from '../../services/api/event';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import {
  EventExploreListItemResponse,
  EventExploreListParams,
} from '../../services/types/event';
import type { RootState } from '../../store/store';

export type EventExploreListItem = EventExploreListItemResponse;
type EventExploreListStore = EntityState<EventExploreListItem> & {
  status: AsyncRequestStatus;
  errorMsg: string;
  currentRequestId: string | undefined; // 当前正在请求的id(由createAsyncThunk生成的唯一id)
};
export const eventExploreListEntity = createEntityAdapter<EventExploreListItem>(
  {
    selectId: (item) => item.id,
  }
);
const initTodoTasksState: EventExploreListStore =
  eventExploreListEntity.getInitialState({
    status: AsyncRequestStatus.IDLE,
    errorMsg: '',
    currentRequestId: undefined,
  });

export const fetchEventExploreList = createAsyncThunk<
  Array<EventExploreListItem>,
  EventExploreListParams
>('event/explore/list', async (params, { rejectWithValue }) => {
  const resp = await fetchListForEventExplore(params);
  if (resp.data.code === ApiRespCode.SUCCESS) {
    return resp.data.data;
  }
  return rejectWithValue(new Error(resp.data.msg));
});

export const eventExploreListSlice = createSlice({
  name: 'eventExploreList',
  initialState: initTodoTasksState,
  reducers: {
    updateOne: (...args) => eventExploreListEntity.updateOne(...args),
    setOne: (...args) => eventExploreListEntity.setOne(...args),
    removeAll: (state) => eventExploreListEntity.removeAll(state),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventExploreList.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchEventExploreList.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        eventExploreListEntity.setAll(state, action.payload);
      })
      .addCase(fetchEventExploreList.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        eventExploreListEntity.setAll(state, []);
        state.errorMsg = action.error.message || '';
      });
  },
});

const { actions, reducer } = eventExploreListSlice;
export const { selectAll, selectById } = eventExploreListEntity.getSelectors(
  (state: RootState) => state.eventExploreList
);
export const selectState = (state: RootState) => state.eventExploreList;
export const { updateOne, setOne, removeAll } = actions;
export default reducer;
