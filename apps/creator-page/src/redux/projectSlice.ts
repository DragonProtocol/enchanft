import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AsyncRequestStatus, fetchDetailByProjectSlug } from '../api';
import { MintStage } from '../Components/Project/types';
import { RootState } from './store';

export enum TaskType {
  DEFAULT = 'DEFAULT',
}

export type Task = {
  id: number;
  name: string;
  image: string;
  whitelistTotalNum: number;
  type: TaskType;
  projectId: number;
  startTime: number;
  endTime: number;
  description: string;
  reward: {
    name: string;
    type: string;
    raffled: boolean;
  };
};
export type Whitelist = {
  id?: number;
  mintMaxNum: number;
  mintPrice: string;
  mintStartTime: number;
  mintEndTime: number;
  projectId?: number;
  totalNum: number;
};
export enum ProjectStatus {
  DEFAULT = 'DEFAULT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type ProjectDetail = {
  slug: string;
  id: number;
  image: string;
  name: string;
  description: string;
  status: ProjectStatus;
  mintStage: MintStage;
  mintUrl: string;
  mintLimited: number;
  discord: string;
  twitter: string;
  injectedCoins: string;
  itemTotalNum: number;
  tokenContract: string;
  announcement: {
    title: string;
    text: string;
  };
  community: {
    id: number;
    website: string;
    discordInviteUrl: string;
    twitterId: string;
    twitterName: string;
    discordId: string;
  };
  publicSaleStartTime: number;
  publicSaleEndTime: number;
  publicSalePrice: string;
  tasks: Task[];
  whitelists: Whitelist[];
  teamMembers: any[];
  announcementText?: string;
  announcementTitle?: string;
  isVIP?: boolean;
  level?: number;
  //
  chainId?: number;
};

const InitState: {
  code: number;
  msg: string;
  status: AsyncRequestStatus;
  data: ProjectDetail | null;
} = {
  code: 0,
  msg: '',
  status: AsyncRequestStatus.IDLE,
  data: null,
};

export const fetchProjectDetail = createAsyncThunk(
  'project/fetchProjectDetail',
  async ({ slug, token }: { slug: string; token: string }) => {
    const resp = await fetchDetailByProjectSlug(slug, token);
    return resp.data;
  }
);

export const projectDetailSlice = createSlice({
  name: 'projectDetail',
  initialState: InitState,
  reducers: {
    // updateProjectDetail: (state, action) => {
    //   state.data = { ...state.data, ...action.payload }
    // },
    // resetProjectDetailState: (state) => {
    //   Object.assign(state, initProjectState)
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDetail.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchProjectDetail.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.data = action.payload.data;
      })
      .addCase(fetchProjectDetail.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = projectDetailSlice;
export const selectProjectDetail = (state: RootState) => state.projectDetail;
// export const { updateProjectDetail, resetProjectDetailState } = actions
export default reducer;
