import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDetailByProjectSlug } from '../api';
import { RootState } from './store';

export const projectListSlice = createSlice({
  name: 'projectList',
  initialState: {},
  reducers: {
    // updateProjectDetail: (state, action) => {
    //   state.data = { ...state.data, ...action.payload }
    // },
    // resetProjectDetailState: (state) => {
    //   Object.assign(state, initProjectState)
    // },
  },
});

const { actions, reducer } = projectListSlice;
export const selectProjectDetail = (state: RootState) => state.projectList;
export default reducer;
