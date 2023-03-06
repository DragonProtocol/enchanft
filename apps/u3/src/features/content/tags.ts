/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-10 15:09:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 16:48:32
 * @Description: file description
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import { fetchContentTags as fetchContentTagsApi } from '../../services/api/contents';
import type { RootState } from '../../store/store';

type ContentTagsState = {
  status: AsyncRequestStatus;
  tags: string[];
};
const initContentTagsState: ContentTagsState = {
  status: AsyncRequestStatus.IDLE,
  tags: [],
};

export const fetchContentTags = createAsyncThunk<Array<string>, undefined>(
  'content/platforms',
  async (params, { rejectWithValue }) => {
    const resp = await fetchContentTagsApi();
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  }
);

export const contentContentTagsSlice = createSlice({
  name: 'contentContentTags',
  initialState: initContentTagsState,
  reducers: {
    addOne: (state, action) => {
      state.tags.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentTags.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchContentTags.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.tags = action.payload;
      })
      .addCase(fetchContentTags.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = contentContentTagsSlice;
export const { addOne } = actions;
export const selectState = (state: RootState) => state.contentTags;
export default reducer;
