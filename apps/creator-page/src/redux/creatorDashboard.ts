import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncRequestStatus, creatorApi, saveWinnersApi } from '../api';
import { RewardType, RewardData } from '../Components/TaskCreate/type';
import { RootState } from './store';

export type ScheduleInfo = {
  closeTime: string;
  endTime: string;
  startTime: string;
  pickWinnersTime?: string;
  submitTime: string;
};

export type TaskInfo = {
  actions: Array<string>;
  description: string;
  endTime: string;
  name: string;
  startTime: string;
  type: string;
  winnerNum: number;
};

export type Winner = {
  id: number;
  avatar: string;
  name: string;
  pubkey: string;
};

export type PickedWhiteList = {
  task_id: number;
  user_id: number;
};

export type CreatorState = {
  status: AsyncRequestStatus;
  saveStatus: AsyncRequestStatus;
  participants: number;
  winners: number;
  whitelistSaved: boolean;
  winnerList: Array<Winner>;
  candidateList: Array<Winner>;
  participantList: Array<Winner>;
  pickedWhiteList: Array<PickedWhiteList>;
  taskInfo: TaskInfo | null;
  scheduleInfo: ScheduleInfo | null;
  reward: {
    name: string;
    type: RewardType;
    raffled: boolean;
    data: RewardData;
  };
};

// 站点状态信息
const creatorState: CreatorState = {
  status: AsyncRequestStatus.IDLE,
  saveStatus: AsyncRequestStatus.IDLE,
  participants: 0,
  winners: 0,
  whitelistSaved: false,
  winnerList: [],
  candidateList: [],
  participantList: [],
  pickedWhiteList: [],
  taskInfo: null,
  scheduleInfo: null,
  reward: {
    type: RewardType.WHITELIST,
    raffled: false,
    name: '',
    data: {},
  },
};

export const getCreatorDashboardData = createAsyncThunk(
  'creator/dashboard',
  async ({ taskId, token }: { taskId: number; token: string }) => {
    const resp = await creatorApi(taskId, token);
    return resp.data;
  }
);

export const saveWinnersData = createAsyncThunk(
  'creator/saveWinners',
  async (
    {
      taskId,
      winners,
      token,
    }: {
      token: string;
      taskId: number;
      winners: Array<number>;
    },
    ThunkAPI
  ) => {
    const resp = await saveWinnersApi(
      { task: taskId, whitelist: winners },
      token
    );
    ThunkAPI.dispatch(getCreatorDashboardData({ taskId, token }));
    return resp.data;
  }
);

export const creatorSlice = createSlice({
  name: 'website',
  initialState: creatorState,
  reducers: {
    some: (state) => {},
    resetData: (state) => {
      state.status = AsyncRequestStatus.FULFILLED;
      state.participants = creatorState.participants;
      state.winners = creatorState.winners;
      state.whitelistSaved = creatorState.whitelistSaved;
      state.winnerList = creatorState.winnerList;
      state.candidateList = creatorState.candidateList;
      state.participantList = creatorState.participantList;
      state.scheduleInfo = creatorState.scheduleInfo;
      state.taskInfo = creatorState.taskInfo;
      state.reward = creatorState.reward;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCreatorDashboardData.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(getCreatorDashboardData.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.participants = action.payload.participants;
        state.participantList = action.payload.participantList;
        state.winners = action.payload.winners;
        state.whitelistSaved = action.payload.whitelistSaved;
        state.winnerList = action.payload.winnerList;
        state.candidateList = action.payload.candidateList;
        state.pickedWhiteList = action.payload.pickedWhiteList;
        state.scheduleInfo = action.payload.scheduleInfo;
        state.taskInfo = action.payload.taskInfo;
        state.reward = action.payload.reward;
      })
      .addCase(getCreatorDashboardData.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
      })
      /////
      .addCase(saveWinnersData.pending, (state, action) => {
        state.saveStatus = AsyncRequestStatus.PENDING;
      })
      .addCase(saveWinnersData.fulfilled, (state, action) => {
        state.saveStatus = AsyncRequestStatus.FULFILLED;
        state.whitelistSaved = true;
      })
      .addCase(saveWinnersData.rejected, (state, action) => {
        state.saveStatus = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = creatorSlice;
export const { resetData } = actions;
export const selectCreator = (state: RootState) => state.creatorDashboard;
export default reducer;
