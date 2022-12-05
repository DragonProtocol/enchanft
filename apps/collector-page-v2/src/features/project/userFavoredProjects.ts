/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-02 16:40:20
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 19:19:13
 * @Description: file description
 */
import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { fetchListForProjectExplore } from '../../services/api/project';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import { ProjectFavoriteListItemResponse } from '../../services/types/project';
import type { RootState } from '../../store/store';

export type FavoredProjectForEntity = ProjectFavoriteListItemResponse;
type FavoredCommunityListState = EntityState<FavoredProjectForEntity> & {
  status: AsyncRequestStatus;
  errorMsg: string;
  currentRequestId: string | undefined; // 当前正在请求的id(由createAsyncThunk生成的唯一id)
};
export const userFavoredProjectsEntity =
  createEntityAdapter<FavoredProjectForEntity>({
    selectId: (item) => item.id,
  });
const initFavoredProjectsState: FavoredCommunityListState =
  userFavoredProjectsEntity.getInitialState({
    status: AsyncRequestStatus.IDLE,
    errorMsg: '',
    currentRequestId: undefined,
  });
export const fetchFavoredProjects = createAsyncThunk<
  Array<FavoredProjectForEntity>,
  undefined
>('project/user/favored', (params, { rejectWithValue }) => {
  // TODO 获取用户喜欢的project api待对接
  // const resp = await fetchListForProjectExplore(params);
  // if (resp.data.code === ApiRespCode.SUCCESS) {
  //   return resp.data.data;
  // }
  // return rejectWithValue(new Error(resp.data.msg));
  return [];
});

export const userFavoredProjectsSlice = createSlice({
  name: 'userFavoredProjects',
  initialState: initFavoredProjectsState,
  reducers: {
    addOne: (...args) => userFavoredProjectsEntity.addOne(...args),
    updateOne: (...args) => userFavoredProjectsEntity.updateOne(...args),
    setOne: (...args) => userFavoredProjectsEntity.setOne(...args),
    removeOne: (...args) => userFavoredProjectsEntity.removeOne(...args),
    removeAll: (state) => userFavoredProjectsEntity.removeAll(state),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoredProjects.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchFavoredProjects.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        userFavoredProjectsEntity.setAll(state, action.payload);
      })
      .addCase(fetchFavoredProjects.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        userFavoredProjectsEntity.setAll(state, []);
        state.errorMsg = action.error.message || '';
      });
  },
});

const { actions, reducer } = userFavoredProjectsSlice;
export const { selectAll, selectById } = userFavoredProjectsEntity.getSelectors(
  (state: RootState) => state.userFavoredProjects
);
export const selectState = (state: RootState) => state.userFavoredProjects;
export const { addOne, updateOne, setOne, removeOne, removeAll } = actions;
export default reducer;
