/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-13 19:33:55
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
import { OrderBy } from '../../services/types/common';
import { ProjectExploreListItemResponse } from '../../services/types/project';
import type { RootState } from '../../store/store';

export type ProjectSelectListItem = ProjectExploreListItemResponse;
type ProjectSelectListStore = EntityState<ProjectSelectListItem> & {
  status: AsyncRequestStatus;
  errorMsg: string;
  currentRequestId: string | undefined; // 当前正在请求的id(由createAsyncThunk生成的唯一id)
};
export const projectSelectListEntity =
  createEntityAdapter<ProjectSelectListItem>({
    selectId: (item) => item.id,
  });
const initProjectSelectListState: ProjectSelectListStore =
  projectSelectListEntity.getInitialState({
    status: AsyncRequestStatus.IDLE,
    errorMsg: '',
    currentRequestId: undefined,
  });

export const fetchProjectSelectList = createAsyncThunk<
  Array<ProjectSelectListItem>,
  undefined
>('project/select/list', async (params, { rejectWithValue }) => {
  // TODO 暂时先取TRENDING的前20条，后期要有一个获取所有project的接口
  const tempParams = {
    orderBy: OrderBy.TRENDING,
    pageSize: 20,
    pageNumber: 0,
  };
  const resp = await fetchListForProjectExplore(tempParams);
  if (resp.data.code === ApiRespCode.SUCCESS) {
    return resp.data.data;
  }
  return rejectWithValue(new Error(resp.data.msg));
});

export const projectSelectListSlice = createSlice({
  name: 'projectSelectList',
  initialState: initProjectSelectListState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectSelectList.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchProjectSelectList.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        projectSelectListEntity.setAll(state, action.payload);
      })
      .addCase(fetchProjectSelectList.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        projectSelectListEntity.setAll(state, []);
        state.errorMsg = action.error.message || '';
      });
  },
});

const { reducer } = projectSelectListSlice;
export const { selectAll, selectById } = projectSelectListEntity.getSelectors(
  (state: RootState) => state.projectSelectList
);
export const selectState = (state: RootState) => state.projectSelectList;
export default reducer;
