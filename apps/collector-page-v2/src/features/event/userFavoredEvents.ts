/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-02 16:40:20
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 19:16:18
 * @Description: file description
 */
import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import { EventFavoriteListItemResponse } from '../../services/types/event';
import type { RootState } from '../../store/store';

export type FavoredEventForEntity = EventFavoriteListItemResponse;
type FavoredCommunityListState = EntityState<FavoredEventForEntity> & {
  status: AsyncRequestStatus;
  errorMsg: string;
  currentRequestId: string | undefined; // 当前正在请求的id(由createAsyncThunk生成的唯一id)
};
export const userFavoredEventsEntity =
  createEntityAdapter<FavoredEventForEntity>({
    selectId: (item) => item.id,
  });
const initFavoredEventsState: FavoredCommunityListState =
  userFavoredEventsEntity.getInitialState({
    status: AsyncRequestStatus.IDLE,
    errorMsg: '',
    currentRequestId: undefined,
  });
export const fetchFavoredEvents = createAsyncThunk<
  Array<FavoredEventForEntity>,
  undefined
>('event/user/favoredList', (params, { rejectWithValue }) => {
  // TODO 获取用户喜欢的event api 待对接
  // const resp = await fetchListForEventExplore(params);
  // if (resp.data.code === ApiRespCode.SUCCESS) {
  //   return resp.data.data;
  // }
  // return rejectWithValue(new Error(resp.data.msg));
  return [];
});

export const userFavoredEventsSlice = createSlice({
  name: 'userFavoredEvents',
  initialState: initFavoredEventsState,
  reducers: {
    addOne: (...args) => userFavoredEventsEntity.addOne(...args),
    updateOne: (...args) => userFavoredEventsEntity.updateOne(...args),
    setOne: (...args) => userFavoredEventsEntity.setOne(...args),
    removeOne: (...args) => userFavoredEventsEntity.removeOne(...args),
    removeAll: (state) => userFavoredEventsEntity.removeAll(state),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoredEvents.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchFavoredEvents.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        userFavoredEventsEntity.setAll(state, action.payload);
      })
      .addCase(fetchFavoredEvents.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        userFavoredEventsEntity.setAll(state, []);
        state.errorMsg = action.error.message || '';
      });
  },
});

const { actions, reducer } = userFavoredEventsSlice;
export const { selectAll, selectById } = userFavoredEventsEntity.getSelectors(
  (state: RootState) => state.userFavoredEvents
);
export const selectState = (state: RootState) => state.userFavoredEvents;
export const { addOne, updateOne, setOne, removeOne, removeAll } = actions;
export default reducer;
