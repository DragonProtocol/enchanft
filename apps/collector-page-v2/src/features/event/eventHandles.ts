/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-23 15:54:47
 * @Description: file description
 */
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { AsyncRequestStatus } from '../../services/types';
import {
  EventEntity,
  EventExploreListItemResponse,
} from '../../services/types/event';
import type { RootState } from '../../store/store';
import {
  favorEvent as favorEventApi,
  completeEvent as completeEventApi,
} from '../../services/api/event';
import { addOne as addOneToCompletedEvents } from './userCompletedEvents';
import { addOneWithEvents } from '../favorite/userGroupFavorites';
import { updateOne as updateOneWithEventExplore } from './eventExploreList';

// 为event 点赞操作 创建一个执行队列
export type FavorEventParams = EventExploreListItemResponse;
export type FavorEventEntity = EventEntity;
type FavorEventQueueState = EntityState<FavorEventEntity>;
export const favorEventQueueEntity = createEntityAdapter<FavorEventEntity>({
  selectId: (item) => item.id,
});
const favorEventQueueState: FavorEventQueueState =
  favorEventQueueEntity.getInitialState();

// 为event 标记为操作 创建一个执行队列
export type CompleteEventParams = EventExploreListItemResponse;
export type CompleteEventEntity = EventEntity;
type CompleteEventQueueState = EntityState<CompleteEventEntity>;
export const completeEventQueueEntity =
  createEntityAdapter<CompleteEventEntity>({
    selectId: (item) => item.id,
  });
const completeEventQueueState: CompleteEventQueueState =
  completeEventQueueEntity.getInitialState();

// 统一管理操作
export type EventHandle<T> = {
  params: T | null;
  status: AsyncRequestStatus;
  errorMsg: string;
};

export type EventHandlesState = {
  favorEvent: EventHandle<FavorEventParams>;
  favorEventQueue: FavorEventQueueState;
  completeEvent: EventHandle<CompleteEventParams>;
  completeEventQueue: FavorEventQueueState;
};

// init data
const initEventHandlestate = {
  params: null,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
};
const initEventHandlesState: EventHandlesState = {
  favorEvent: initEventHandlestate,
  favorEventQueue: favorEventQueueState,
  completeEvent: initEventHandlestate,
  completeEventQueue: completeEventQueueState,
};

// favor event
export const favorEvent = createAsyncThunk(
  'user/eventHandles/favorEvent',
  async (params: FavorEventParams, { dispatch }) => {
    dispatch(addOneToFavorEventQueue(params));
    const resp = await favorEventApi({
      id: params.id,
      uuid: params?.uuid || '',
      isForU: params?.isForU || false,
    });
    if (resp.data.code === 0) {
      dispatch(updateOneWithEventExplore({ id: params.id, favored: true }));
      dispatch(addOneWithEvents(params));
      dispatch(removeOneForFavorEventQueue(params.id));
    } else {
      dispatch(removeOneForFavorEventQueue(params.id));
      throw new Error(resp.data.msg);
    }
  },
  {
    condition: (params: FavorEventParams, { getState }) => {
      const state = getState() as RootState;
      const { selectById } = favorEventQueueEntity.getSelectors();
      const item = selectById(state.eventHandles.favorEventQueue, params.id);
      // 如果正在请求阻止新的请求
      return !item;
    },
  }
);

// complete event
export const completeEvent = createAsyncThunk(
  'user/eventHandles/completeEvent',
  async (params: CompleteEventParams, { dispatch }) => {
    dispatch(addOneToCompleteEventQueue(params));
    const resp = await completeEventApi({
      id: params.id,
      uuid: params?.uuid || '',
      isForU: params?.isForU || false,
    });
    if (resp.data.code === 0) {
      dispatch(updateOneWithEventExplore({ id: params.id, completed: true }));
      dispatch(addOneToCompletedEvents(params));
      dispatch(removeOneForCompleteEventQueue(params.id));
    } else {
      dispatch(removeOneForCompleteEventQueue(params.id));
      throw new Error(resp.data.msg);
    }
  },
  {
    condition: (params: CompleteEventParams, { getState }) => {
      const state = getState() as RootState;
      const { selectById } = completeEventQueueEntity.getSelectors();
      const item = selectById(state.eventHandles.completeEventQueue, params.id);
      // 如果正在请求阻止新的请求
      return !item;
    },
  }
);

export const eventHandlesSlice = createSlice({
  name: 'EventHandles',
  initialState: initEventHandlesState,
  reducers: {
    addOneToFavorEventQueue: (state, action) => {
      favorEventQueueEntity.addOne(state.favorEventQueue, action.payload);
    },
    removeOneForFavorEventQueue: (state, action) => {
      favorEventQueueEntity.removeOne(state.favorEventQueue, action.payload);
    },
    addOneToCompleteEventQueue: (state, action) => {
      completeEventQueueEntity.addOne(state.completeEventQueue, action.payload);
    },
    removeOneForCompleteEventQueue: (state, action) => {
      completeEventQueueEntity.removeOne(
        state.completeEventQueue,
        action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(favorEvent.pending, (state, action) => {
        state.favorEvent.params = action.meta.arg;
        state.favorEvent.status = AsyncRequestStatus.PENDING;
        state.favorEvent.errorMsg = '';
      })
      .addCase(favorEvent.fulfilled, (state, action) => {
        state.favorEvent.params = null;
        state.favorEvent.status = AsyncRequestStatus.FULFILLED;
        state.favorEvent.errorMsg = '';
        toast.success('Ok.');
      })
      .addCase(favorEvent.rejected, (state, action) => {
        state.favorEvent.params = null;
        state.favorEvent.status = AsyncRequestStatus.REJECTED;
        state.favorEvent.errorMsg = action.error.message || '';
        toast.error(action.error.message);
      })
      .addCase(completeEvent.pending, (state, action) => {
        state.completeEvent.params = action.meta.arg;
        state.completeEvent.status = AsyncRequestStatus.PENDING;
        state.completeEvent.errorMsg = '';
      })
      .addCase(completeEvent.fulfilled, (state, action) => {
        state.completeEvent.params = null;
        state.completeEvent.status = AsyncRequestStatus.FULFILLED;
        state.completeEvent.errorMsg = '';
        toast.success('Ok.');
      })
      .addCase(completeEvent.rejected, (state, action) => {
        state.completeEvent.params = null;
        state.completeEvent.status = AsyncRequestStatus.REJECTED;
        state.completeEvent.errorMsg = action.error.message || '';
        toast.error(action.error.message);
      });
  },
});

export const selectEventHandlesState = (state: RootState) => state.eventHandles;

export const {
  selectAll: selectAllFavorEventQueue,
  selectIds: selectIdsFavorEventQueue,
  selectById: selectByIdFavorEventQueue,
} = favorEventQueueEntity.getSelectors(
  (state: RootState) => state.eventHandles.favorEventQueue
);

export const {
  selectAll: selectAllCompleteEventQueue,
  selectIds: selectIdsCompleteEventQueue,
  selectById: selectByIdCompleteEventQueue,
} = favorEventQueueEntity.getSelectors(
  (state: RootState) => state.eventHandles.completeEventQueue
);

const { actions, reducer } = eventHandlesSlice;
const {
  addOneToFavorEventQueue,
  removeOneForFavorEventQueue,
  addOneToCompleteEventQueue,
  removeOneForCompleteEventQueue,
} = actions;
export default reducer;
