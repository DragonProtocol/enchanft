import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncRequestStatus, creatorApi, getWorkProofs, PassFlag, reviewWorkProof, ReviewWorkProofParam, saveWinnersApi } from '../api';
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
  thirdpartyName: string;
  luckydrawWeightTotal?: number;
};

export type PickedWhiteList = {
  task_id: number;
  user_id: number;
};

export type CreatorState = {
  status: AsyncRequestStatus;
  saveStatus: AsyncRequestStatus;
  workProofsStatus: AsyncRequestStatus;
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
  workProofs: WorkProofInfo[];
  allWorkProofs: WorkProofInfo[];
};

export type WorkProofInfo = {
  userId: string;
  userName: string;
  userAvatar: string;
  actionId: number;
  actionType: string;
  actionData: {
    question: string,
    answer: string,
    lucky_draw_weight: number,
  },
  passed: boolean;
  submitTime: string;
}
// 站点状态信息
const creatorState: CreatorState = {
  status: AsyncRequestStatus.IDLE,
  saveStatus: AsyncRequestStatus.IDLE,
  workProofsStatus: AsyncRequestStatus.IDLE,
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
  workProofs: [],
  allWorkProofs: []
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

export const submitReviewWorkProof = createAsyncThunk(
  'creator/reviewWorkProof',
  async (
    {
      taskId,
      data,
      token,
    }: {
      token: string;
      data: ReviewWorkProofParam;
      taskId: number;
    },
    ThunkAPI
  ) => {
    const resp = await reviewWorkProof(taskId, data, token);
    ThunkAPI.dispatch(getCreatorDashboardData({ taskId, token }));
    ThunkAPI.dispatch(getWorkProofsData({ taskId: taskId, passFlag: PassFlag.NOT_PROCESSED, token: token }));
    return resp.data;
  }
);

export const getWorkProofsData = createAsyncThunk(
  'creator/workProofs',
  async ({ taskId, passFlag, token }: { taskId: number; passFlag: PassFlag, token: string }) => {
    const resp = await getWorkProofs(taskId, passFlag, token);
    return resp.data;
  }
);

export const creatorSlice = createSlice({
  name: 'website',
  initialState: creatorState,
  reducers: {
    some: (state) => { },
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
      state.workProofs = creatorState.workProofs;
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
        state.workProofs = action.payload.workProofs;
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
      })
      //work proofs
      .addCase(getWorkProofsData.pending, (state, action) => {
        state.workProofsStatus = AsyncRequestStatus.PENDING;
      })
      .addCase(getWorkProofsData.fulfilled, (state, action) => {
        state.workProofsStatus = AsyncRequestStatus.FULFILLED;
        console.log('all work proofs: ', action.payload)
        state.allWorkProofs = action.payload.data;
      })
      .addCase(getWorkProofsData.rejected, (state, action) => {
        state.workProofsStatus = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = creatorSlice;
export const { resetData } = actions;
export const selectCreator = (state: RootState) => state.creatorDashboard;
export default reducer;
