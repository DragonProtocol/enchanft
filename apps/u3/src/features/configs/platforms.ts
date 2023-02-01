/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-10 15:09:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-01 17:49:46
 * @Description: file description
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllPlatform } from '../../services/api/common';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import {
  PlatformsItemResponse,
  PlatformType,
} from '../../services/types/common';
import type { RootState } from '../../store/store';
import { fetchPlatformImgUrlByLink } from '../../utils/platform';
import { getDomainNameByUrl } from '../../utils/url';

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
  async (params, { rejectWithValue, dispatch }) => {
    const resp = await getAllPlatform();
    if (resp.data.code === ApiRespCode.SUCCESS) {
      const eventPlatforms = resp.data.data.filter(
        (item) => item.type === PlatformType.EVENT
      );
      const contentPlatforms = resp.data.data
        .filter((item) => item.type === PlatformType.CONTENT)
        .map((item) => ({
          ...item,
          platform: getDomainNameByUrl(item.platformUrl),
          platformLogo: '',
        }));
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await dispatch(setAll([...eventPlatforms, ...contentPlatforms]));
      for (const item of contentPlatforms) {
        fetchPlatformImgUrlByLink(item.platformUrl).then((url) => {
          dispatch(updateOneByUrl({ ...item, platformLogo: url }));
        });
      }
      return undefined;
    }
    return rejectWithValue(new Error(resp.data.msg));
  }
);

export const configsPlatformsSlice = createSlice({
  name: 'configsPlatforms',
  initialState: initConfigsPlatformsState,
  reducers: {
    updateOneByUrl: (state, action) => {
      const updateData = action.payload;
      const findIndex = state.platforms.findIndex(
        (item) =>
          item.type === updateData.type &&
          item.platformUrl === updateData.platformUrl
      );
      if (findIndex !== -1) {
        state.platforms[findIndex] = { ...updateData };
      }
    },
    setAll: (state, action) => {
      state.platforms = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigsPlatforms.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchConfigsPlatforms.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        // state.platforms = action.payload;
      })
      .addCase(fetchConfigsPlatforms.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = configsPlatformsSlice;
const { setAll, updateOneByUrl } = actions;
export const selectState = (state: RootState) => state.configsPlatforms;
export default reducer;
