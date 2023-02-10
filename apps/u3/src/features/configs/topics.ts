/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-09 17:55:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-09 14:57:39
 * @Description: file description
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getConfigsTopics } from '../../services/api/common';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import { ConfigTopicsChain } from '../../services/types/common';
import type { RootState } from '../../store/store';
import { formatFilterShowName } from '../../utils/filter';

export type TopicItem = {
  value: string;
  name: string;
};
type Topics = {
  eventRewards: TopicItem[];
  eventTypes: TopicItem[];
  projectTypes: TopicItem[];
  contentTypes: TopicItem[];
  langs: TopicItem[];
  chains: ConfigTopicsChain[];
};
type ConfigsTopicsState = {
  status: AsyncRequestStatus;
  topics: Topics;
};
const initConfigsTopicsState: ConfigsTopicsState = {
  status: AsyncRequestStatus.IDLE,
  topics: {
    eventRewards: [],
    eventTypes: [],
    projectTypes: [],
    contentTypes: [],
    langs: [],
    chains: [],
  },
};

const formatTopics = (topics: string[]) => {
  return topics.map((item) => ({
    value: item,
    name: formatFilterShowName(item),
  }));
};
export const fetchConfigsTopics = createAsyncThunk<Topics, undefined>(
  'configs/topics',
  async (params, { rejectWithValue }) => {
    const resp = await getConfigsTopics();
    if (resp.data.code === ApiRespCode.SUCCESS) {
      const { eventRewards, eventTypes, projectTypes, contentTypes, langs } =
        resp.data.data;
      return {
        ...resp.data.data,
        eventRewards: formatTopics(eventRewards || []),
        eventTypes: formatTopics(eventTypes || []),
        projectTypes: formatTopics(projectTypes || []),
        contentTypes: formatTopics(contentTypes || []),
        langs: formatTopics(langs || []),
      };
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const { configsTopics } = state;
      const { status } = configsTopics;
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false;
      }
      return true;
    },
  }
);

export const configsTopicsSlice = createSlice({
  name: 'configsTopics',
  initialState: initConfigsTopicsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigsTopics.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchConfigsTopics.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.topics = action.payload;
      })
      .addCase(fetchConfigsTopics.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
      });
  },
});

const { reducer } = configsTopicsSlice;
export const selectState = (state: RootState) => state.configsTopics;
export default reducer;
