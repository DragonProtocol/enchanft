import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import type { RootState } from '../../store/store';

type KarmaState = {
  status: AsyncRequestStatus;
  score: number;
};

const initKarmaState: KarmaState = {
  status: AsyncRequestStatus.IDLE,
  score: 0,
};

export const karmaSlice = createSlice({
  name: 'karma',
  initialState: initKarmaState,
  reducers: {
    incScore: (state, action) => {
      state.score += action.payload;
    },
  },
  extraReducers: (builder) => {},
});

const { reducer, actions } = karmaSlice;
export const selectKarmaState = (state: RootState) => state.karma;

export const { incScore } = actions;

export default reducer;
