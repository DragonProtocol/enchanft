/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-26 17:47:54
 * @Description: 站点的配置
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';
import {
  setEventCompleteGuideEndToStore,
  verifyEventCompleteGuideEndByStore,
} from '../../utils/event';

type WebsiteState = {
  mobileNavDisplay: boolean;
  u3ExtensionInstalled: boolean;
  eventCompleteGuideEnd: boolean;
  openEventCompleteGuideModal: boolean;
};

// 站点状态信息
const websiteState: WebsiteState = {
  mobileNavDisplay: true,
  u3ExtensionInstalled: false,
  eventCompleteGuideEnd: verifyEventCompleteGuideEndByStore(),
  openEventCompleteGuideModal: false,
};

export const websiteSlice = createSlice({
  name: 'website',
  initialState: websiteState,
  reducers: {
    setMobileNavDisplay: (state, action: PayloadAction<boolean>) => {
      state.mobileNavDisplay = action.payload;
    },
    setU3ExtensionInstalled: (state, action: PayloadAction<boolean>) => {
      state.u3ExtensionInstalled = action.payload;
    },
    setEventCompleteGuideEnd: (state) => {
      state.eventCompleteGuideEnd = true;
      state.openEventCompleteGuideModal = false;
      setEventCompleteGuideEndToStore();
    },
    setOpenEventCompleteGuideModal: (state, action: PayloadAction<boolean>) => {
      state.openEventCompleteGuideModal = action.payload;
    },
  },
});

const { actions, reducer } = websiteSlice;
export const {
  setMobileNavDisplay,
  setU3ExtensionInstalled,
  setEventCompleteGuideEnd,
  setOpenEventCompleteGuideModal,
} = actions;
export const selectWebsite = (state: RootState) => state.website;
export default reducer;
