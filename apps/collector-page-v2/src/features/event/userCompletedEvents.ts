/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-02 16:40:20
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 17:11:09
 * @Description: file description
 */
import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { fetchListForUserCompletedEvents } from '../../services/api/event';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import { EventEntity } from '../../services/types/event';
import type { RootState } from '../../store/store';

export type CompletedEventForEntity = { id: number };
type CompletedCommunityListState = EntityState<CompletedEventForEntity> & {
  status: AsyncRequestStatus;
  errorMsg: string;
  currentRequestId: string | undefined; // 当前正在请求的id(由createAsyncThunk生成的唯一id)
};
export const userCompletedEventsEntity =
  createEntityAdapter<CompletedEventForEntity>({
    selectId: (item) => item.id,
  });
const initCompletedEventsState: CompletedCommunityListState =
  userCompletedEventsEntity.getInitialState({
    status: AsyncRequestStatus.IDLE,
    errorMsg: '',
    currentRequestId: undefined,
  });
export const fetchCompletedEvents = createAsyncThunk<
  Array<CompletedEventForEntity>,
  undefined
>('event/user/completedList', (params) => {
  // TODO 获取用户标记完成的event
  return fetchListForUserCompletedEvents().map((id) => ({ id }));
});

export const userCompletedEventsSlice = createSlice({
  name: 'userCompletedEvents',
  initialState: initCompletedEventsState,
  reducers: {
    addOne: (...args) => userCompletedEventsEntity.addOne(...args),
    updateOne: (...args) => userCompletedEventsEntity.updateOne(...args),
    setOne: (...args) => userCompletedEventsEntity.setOne(...args),
    removeOne: (...args) => userCompletedEventsEntity.removeOne(...args),
    removeAll: (state) => userCompletedEventsEntity.removeAll(state),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompletedEvents.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchCompletedEvents.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        userCompletedEventsEntity.setAll(state, action.payload);
      })
      .addCase(fetchCompletedEvents.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        userCompletedEventsEntity.setAll(state, []);
        state.errorMsg = action.error.message || '';
      });
  },
});

const { actions, reducer } = userCompletedEventsSlice;
export const { selectAll, selectById } = userCompletedEventsEntity.getSelectors(
  (state: RootState) => state.userCompletedEvents
);
export const selectState = (state: RootState) => state.userCompletedEvents;
export const { addOne, updateOne, setOne, removeOne, removeAll } = actions;
export default reducer;
