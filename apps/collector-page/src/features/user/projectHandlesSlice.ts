/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-15 15:31:38
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-01 17:42:50
 * @Description: file description
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { applyForVerificationByProjectId } from '../../services/api/project';
import { RootState } from '../../store/store';
import { AsyncRequestStatus } from '../../types';
import { GradeType } from '../../types/entities';
import { updateProjectDetail } from '../project/projectDetailSlice';
// 每一种操作单独存储当前的数据状态
export type ProjectHandle<T> = {
  params: T | null;
  status: AsyncRequestStatus;
  errorMsg: string;
};
const initProjectHandlestate = {
  params: null,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
};
// 将操作集合到一起，统一管理
export type UserProjectHandlesStateType = {
  applyForVerification: ProjectHandle<number>;
};
const initUserProjectHandlesState: UserProjectHandlesStateType = {
  applyForVerification: initProjectHandlestate,
};

export const applyForVerification = createAsyncThunk(
  'user/projectHandles/applyForVerification',
  async (projectId: number, { dispatch }) => {
    try {
      const resp = await applyForVerificationByProjectId(projectId);
      if (resp.data.code === 0) {
        dispatch(updateProjectDetail({ grade: GradeType.OFFICIAL }));
      } else {
        throw new Error(resp.data.msg);
      }
      return { errorMsg: '' };
    } catch (error) {
      throw error;
    }
  }
);
export const userProjectHandlesSlice = createSlice({
  name: 'ProjectHandles',
  initialState: initUserProjectHandlesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(applyForVerification.pending, (state, action) => {
        console.log('applyForVerification pending', action);
        state.applyForVerification.status = AsyncRequestStatus.PENDING;
        state.applyForVerification.errorMsg = '';
      })
      .addCase(applyForVerification.fulfilled, (state, action) => {
        console.log('applyForVerification fulfilled', action);
        state.applyForVerification.params = null;
        state.applyForVerification.status = AsyncRequestStatus.FULFILLED;
        state.applyForVerification.errorMsg = '';
        toast.success('apply success');
      })
      .addCase(applyForVerification.rejected, (state, action) => {
        console.log('applyForVerification rejected', action);
        state.applyForVerification.params = null;
        state.applyForVerification.status = AsyncRequestStatus.REJECTED;
        state.applyForVerification.errorMsg = action.error.message || '';
        toast.error(action.error.message);
      });
  },
});

export const selectUserProjectHandlesState = (state: RootState) =>
  state.userProjectHandles;

const { actions, reducer } = userProjectHandlesSlice;
export default reducer;
