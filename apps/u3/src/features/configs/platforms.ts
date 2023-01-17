/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-10 15:09:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-10 15:16:49
 * @Description: file description
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllPlatform } from '../../services/api/common';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import { PlatformsItemResponse } from '../../services/types/common';
import type { RootState } from '../../store/store';

type PlatformItem = PlatformsItemResponse;
type Platforms = PlatformItem[];
type ConfigsPlatformsState = {
  status: AsyncRequestStatus;
  platforms: Platforms;
};
const initConfigsPlatformsState: ConfigsPlatformsState = {
  status: AsyncRequestStatus.IDLE,
  platforms: [],
};

export const fetchConfigsPlatforms = createAsyncThunk<Platforms, undefined>(
  'configs/platforms',
  async (params, { rejectWithValue }) => {
    const resp = await getAllPlatform();
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  }
);

export const configsPlatformsSlice = createSlice({
  name: 'configsPlatforms',
  initialState: initConfigsPlatformsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigsPlatforms.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchConfigsPlatforms.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.platforms = action.payload;
      })
      .addCase(fetchConfigsPlatforms.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
      });
  },
});

const { reducer } = configsPlatformsSlice;
export const selectState = (state: RootState) => state.configsPlatforms;
export default reducer;
