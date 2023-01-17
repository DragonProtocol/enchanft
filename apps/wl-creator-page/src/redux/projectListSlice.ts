import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AsyncRequestStatus, creatorProjectApi } from '../api';
import { RootState } from './store';

export const fetchProjectList = createAsyncThunk(
  'project/fetchProjectList',
  async ({ token }: { token: string }) => {
    const resp = await creatorProjectApi(token);
    return resp.data;
  }
);

export type ProjectListItem = {
  id: number;
  slug: string;
  image: string;
  name: string;
};

const InitState: {
  code: number;
  msg: string;
  status: AsyncRequestStatus;
  data: ProjectListItem[] | null;
} = {
  code: 0,
  msg: '',
  status: AsyncRequestStatus.IDLE,
  data: null,
};

export const projectListSlice = createSlice({
  name: 'projectList',
  initialState: InitState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectList.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchProjectList.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.data = action.payload.data.projects;
      })
      .addCase(fetchProjectList.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = projectListSlice;
export const selectProjectList = (state: RootState) => state.projectList;
export default reducer;
