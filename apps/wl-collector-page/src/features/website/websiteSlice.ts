/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 19:10:17
 * @Description: 站点的配置
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';

type WebsiteState = {
  mobileNavDisplay: boolean;
};

// 站点状态信息
const websiteState: WebsiteState = {
  mobileNavDisplay: true,
};

export const websiteSlice = createSlice({
  name: 'website',
  initialState: websiteState,
  reducers: {
    setMobileNavDisplay: (state, action: PayloadAction<boolean>) => {
      state.mobileNavDisplay = action.payload;
    },
  },
});

const { actions, reducer } = websiteSlice;
export const { setMobileNavDisplay } = actions;
export const selectWebsite = (state: RootState) => state.website;
export default reducer;
