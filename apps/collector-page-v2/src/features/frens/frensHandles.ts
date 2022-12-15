/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-07 07:44:20
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
// import {
//   FrensEntity,
//   FrensExploreListItemResponse,
// } from '../../services/types/frens';
import type { RootState } from '../../store/store';
import { getFeed as getFeedApi } from '../../services/api/frens';

// // 统一管理操作
// export type FrensHandle<T> = {
//   params: T | null;
//   status: AsyncRequestStatus;
//   errorMsg: string;
// };

export type FrensHandlesState = {
  feed: any;
  status: AsyncRequestStatus;
  errorMsg: string;
};

// init data
const initFrensHandlesState: FrensHandlesState = {
  feed: {
    total: null,
    cursor: null,
    result: null,
  },
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
};

// favor frens
export const getFeed = createAsyncThunk(
  'user/frensHandles/favorFrens',
  async (
    {
      category,
      cursor,
      address,
      reset = false,
    }: {
      category?: string;
      cursor?: string;
      address?: string;
      reset?: boolean;
    },
    { dispatch }
  ) => {
    const resp = await getFeedApi({ category, cursor, address });
    if (resp.data.code === 0) {
      dispatch(getFeedSuccess({ data: resp?.data?.data, reset }));
    } else {
      throw new Error(resp.data.msg);
    }
  }
);

export const frensHandlesSlice = createSlice({
  name: 'FrensHandles',
  initialState: initFrensHandlesState,
  reducers: {
    getFeedSuccess: (state, action) => {
      let result = action?.payload?.data?.data?.result || [];
      if (!action?.payload?.reset) {
        result = [...state.feed.result, ...result];
      }

      state.feed = {
        cursor: action?.payload?.data?.data?.cursor,
        result,
        total: action?.payload?.data?.data?.total,
      };
      // state.feed = action?.payload?.data?.data;

      // favorFrensQueueEntity.addOne(state.favorFrensQueue, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state, action) => {
        // state.feed.total = action.meta.arg;
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        // console.log('---------------->', action);
        // state.feed.total = action;
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        toast.success('Ok.');
      })
      .addCase(getFeed.rejected, (state, action) => {
        // state.feed = null;
        state.status = AsyncRequestStatus.REJECTED;
        state.errorMsg = action.error.message || '';
        toast.error(action.error.message);
      });
  },
});

export const selectFrensHandlesState = (state: RootState) => state.frensHandles;

const { actions, reducer } = frensHandlesSlice;
const { getFeedSuccess } = actions;
export default reducer;
