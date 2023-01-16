/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-07 18:28:25
 * @Description: file description
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { createEvent } from '../../services/api/event';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import { CreateEventData } from '../../services/types/event';
import type { RootState } from '../../store/store';

type EventExploreListState = {
  status: AsyncRequestStatus;
  errorMsg: string;
};

const initEventCreateState: EventExploreListState = {
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
};

export const eventCreate = createAsyncThunk<unknown, CreateEventData>(
  'event/create',
  async (params, { rejectWithValue }) => {
    const resp = await createEvent(params);
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  }
);

export const eventCreateSlice = createSlice({
  name: 'eventCreate',
  initialState: initEventCreateState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(eventCreate.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
      })
      .addCase(eventCreate.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        toast.success('ok.');
      })
      .addCase(eventCreate.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.errorMsg = action.error.message || '';
        toast.error(state.errorMsg);
      });
  },
});

const { reducer } = eventCreateSlice;
export const selectState = (state: RootState) => state.eventCreate;
export default reducer;
