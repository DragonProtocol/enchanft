/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-02 14:04:58
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
import {
  ProjectExploreListItemResponse,
  ProjectExploreListParams,
} from '../../services/types/project';
import type { RootState } from '../../store/store';

export type ProjectExploreListItem = ProjectExploreListItemResponse;
type ProjectExploreListStore = EntityState<ProjectExploreListItem> & {
  status: AsyncRequestStatus;
  errorMsg: string;
  currentRequestId: string | undefined; // 当前正在请求的id(由createAsyncThunk生成的唯一id)
};
export const projectExploreListEntity =
  createEntityAdapter<ProjectExploreListItem>({
    selectId: (item) => item.id,
  });
const initTodoTasksState: ProjectExploreListStore =
  projectExploreListEntity.getInitialState({
    status: AsyncRequestStatus.IDLE,
    errorMsg: '',
    currentRequestId: undefined,
  });

export const fetchProjectExploreList = createAsyncThunk<
  Array<ProjectExploreListItem>,
  ProjectExploreListParams
>('project/explore/list', async (params, { rejectWithValue }) => {
  const resp = await fetchListForProjectExplore(params);
  if (resp.data.code === ApiRespCode.SUCCESS) {
    return resp.data.data;
  }
  return rejectWithValue(new Error(resp.data.msg));
});

export const projectExploreListSlice = createSlice({
  name: 'projectExploreList',
  initialState: initTodoTasksState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectExploreList.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchProjectExploreList.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        projectExploreListEntity.setAll(state, action.payload);
      })
      .addCase(fetchProjectExploreList.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        projectExploreListEntity.setAll(state, []);
        state.errorMsg = action.error.message || '';
      });
  },
});

const { reducer } = projectExploreListSlice;
export const { selectAll, selectById } = projectExploreListEntity.getSelectors(
  (state: RootState) => state.projectExploreList
);
export const selectState = (state: RootState) => state.projectExploreList;
export default reducer;
