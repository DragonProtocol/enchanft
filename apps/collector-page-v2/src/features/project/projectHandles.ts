/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-02 17:59:08
 * @Description: file description
 */
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { AsyncRequestStatus } from '../../services/types';
import { ProjectEntity } from '../../services/types/project';
import type { RootState } from '../../store/store';
import { favorProject as favorProjectApi } from '../../services/api/project';
import { addOne as addOneToFavoredProjects } from './userFavoredProjects';

// 为project 点赞操作 创建一个执行队列
export type FavorProjectParams = {
  id: number;
};
export type FavorProjectEntity = ProjectEntity;
type FavorProjectQueueState = EntityState<FavorProjectEntity>;
export const favorProjectQueueEntity = createEntityAdapter<FavorProjectEntity>({
  selectId: (item) => item.id,
});
const favorProjectQueueState: FavorProjectQueueState =
  favorProjectQueueEntity.getInitialState();

// 为project 标记为操作 创建一个执行队列
export type CompleteProjectParams = {
  id: number;
};
export type CompleteProjectEntity = ProjectEntity;
type CompleteProjectQueueState = EntityState<CompleteProjectEntity>;
export const completeProjectQueueEntity =
  createEntityAdapter<CompleteProjectEntity>({
    selectId: (item) => item.id,
  });
const completeProjectQueueState: CompleteProjectQueueState =
  completeProjectQueueEntity.getInitialState();

// 统一管理操作
export type ProjectHandle<T> = {
  params: T | null;
  status: AsyncRequestStatus;
  errorMsg: string;
};

export type ProjectHandlesState = {
  favorProject: ProjectHandle<FavorProjectParams>;
  favorProjectQueue: FavorProjectQueueState;
  completeProject: ProjectHandle<FavorProjectParams>;
  completeProjectQueue: FavorProjectQueueState;
};

// init data
const initProjectHandlestate = {
  params: null,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
};
const initProjectHandlesState: ProjectHandlesState = {
  favorProject: initProjectHandlestate,
  favorProjectQueue: favorProjectQueueState,
  completeProject: initProjectHandlestate,
  completeProjectQueue: completeProjectQueueState,
};

// favor project
export const favorProject = createAsyncThunk(
  'user/projectHandles/favorProject',
  async (params: FavorProjectParams, { dispatch }) => {
    dispatch(addOneToFavorProjectQueue(params));
    const resp = await favorProjectApi(params.id);
    if (resp.data.code === 0) {
      dispatch(addOneToFavoredProjects(params));
      dispatch(removeOneForFavorProjectQueue(params.id));
    } else {
      dispatch(removeOneForFavorProjectQueue(params.id));
      throw new Error(resp.data.msg);
    }
  },
  {
    condition: (params: FavorProjectParams, { getState }) => {
      const state = getState() as RootState;
      const { selectById } = favorProjectQueueEntity.getSelectors();
      const item = selectById(
        state.projectHandles.favorProjectQueue,
        params.id
      );
      // 如果正在请求阻止新的请求
      return !item;
    },
  }
);

export const projectHandlesSlice = createSlice({
  name: 'ProjectHandles',
  initialState: initProjectHandlesState,
  reducers: {
    addOneToFavorProjectQueue: (state, action) => {
      favorProjectQueueEntity.addOne(state.favorProjectQueue, action.payload);
    },
    removeOneForFavorProjectQueue: (state, action) => {
      favorProjectQueueEntity.removeOne(
        state.favorProjectQueue,
        action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(favorProject.pending, (state, action) => {
        state.favorProject.params = action.meta.arg;
        state.favorProject.status = AsyncRequestStatus.PENDING;
        state.favorProject.errorMsg = '';
      })
      .addCase(favorProject.fulfilled, (state, action) => {
        state.favorProject.params = null;
        state.favorProject.status = AsyncRequestStatus.FULFILLED;
        state.favorProject.errorMsg = '';
        toast.success('Applied.');
      })
      .addCase(favorProject.rejected, (state, action) => {
        state.favorProject.params = null;
        state.favorProject.status = AsyncRequestStatus.REJECTED;
        state.favorProject.errorMsg = action.error.message || '';
        toast.error(action.error.message);
      });
  },
});

export const selectProjectHandlesState = (state: RootState) =>
  state.projectHandles;

export const {
  selectAll: selectAllFavorProject,
  selectIds: selectIdsFavorProject,
  selectById: selectByIdFavorProject,
} = favorProjectQueueEntity.getSelectors(
  (state: RootState) => state.projectHandles.favorProjectQueue
);

const { actions, reducer } = projectHandlesSlice;
const { addOneToFavorProjectQueue, removeOneForFavorProjectQueue } = actions;
export default reducer;
