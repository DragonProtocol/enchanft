/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 14:31:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-09 14:44:15
 * @Description: 用户的 favorites 分组数据
 */
import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { fetchUserFavoritesByGroup } from '../../services/api/favorite';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import {
  ContentFavoriteListItemResponse,
  EventFavoriteListItemResponse,
  ProjectFavoriteListItemResponse,
  UserGroupFavorites,
} from '../../services/types/favorite';
import type { RootState } from '../../store/store';

export type EventsEntityItem = EventFavoriteListItemResponse;
export type ProjectsEntityItem = ProjectFavoriteListItemResponse;
export type ContentsEntityItem = ContentFavoriteListItemResponse;
export type GroupFavoritesState = {
  status: AsyncRequestStatus;
  errorMsg: string;
  events: EntityState<EventsEntityItem>;
  projects: EntityState<ProjectsEntityItem>;
  contents: EntityState<ContentsEntityItem>;
};
export const eventsEntity = createEntityAdapter<EventFavoriteListItemResponse>({
  selectId: (item) => item.id,
});
export const projectsEntity =
  createEntityAdapter<ProjectFavoriteListItemResponse>({
    selectId: (item) => item.id,
  });
export const contentsEntity =
  createEntityAdapter<ContentFavoriteListItemResponse>({
    selectId: (item) => item.id,
  });
const initEventsEntity = eventsEntity.getInitialState();
const initProjectsEntity = projectsEntity.getInitialState();
const initContentsEntity = contentsEntity.getInitialState();
const initGroupFavoritesState: GroupFavoritesState = {
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  events: initEventsEntity,
  projects: initProjectsEntity,
  contents: initContentsEntity,
};
export const fetchUserGroupFavorites = createAsyncThunk<
  UserGroupFavorites,
  undefined
>(
  'favorite/userGroupFavorites',
  async (params, { rejectWithValue }) => {
    const resp = await fetchUserFavoritesByGroup();
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const { userGroupFavorites } = state;
      const { status } = userGroupFavorites;
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false;
      }
      return true;
    },
  }
);

export const userGroupFavoritesSlice = createSlice({
  name: 'userGroupFavorites',
  initialState: initGroupFavoritesState,
  reducers: {
    // events
    addOneWithEvents: (state, ...args) => {
      eventsEntity.addOne(state.events, ...args);
    },
    updateOneWithEvents: (state, ...args) => {
      eventsEntity.updateOne(state.events, ...args);
    },
    setOneWithEvents: (state, ...args) => {
      eventsEntity.setOne(state.events, ...args);
    },
    removeOneWithEvents: (state, ...args) => {
      eventsEntity.removeOne(state.events, ...args);
    },
    removeAllWithEvents: (state) => {
      eventsEntity.removeAll(state.events);
    },
    // projects
    addOneWithProjects: (state, ...args) => {
      projectsEntity.addOne(state.projects, ...args);
    },
    updateOneWithProjects: (state, ...args) => {
      projectsEntity.updateOne(state.projects, ...args);
    },
    setOneWithProjects: (state, ...args) => {
      projectsEntity.setOne(state.projects, ...args);
    },
    removeOneWithProjects: (state, ...args) => {
      projectsEntity.removeOne(state.projects, ...args);
    },
    removeAllWithProjects: (state) => {
      projectsEntity.removeAll(state.projects);
    },
    // contents
    addOneWithContents: (state, ...args) => {
      contentsEntity.addOne(state.contents, ...args);
    },
    updateOneWithContents: (state, ...args) => {
      contentsEntity.updateOne(state.contents, ...args);
    },
    setOneWithContents: (state, ...args) => {
      contentsEntity.setOne(state.contents, ...args);
    },
    removeOneWithContents: (state, ...args) => {
      contentsEntity.removeOne(state.contents, ...args);
    },
    removeAllWithContents: (state) => {
      contentsEntity.removeAll(state.contents);
    },

    // common
    removeAllFavorites: (state) => {
      eventsEntity.removeAll(state.events);
      projectsEntity.removeAll(state.projects);
      contentsEntity.removeAll(state.contents);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserGroupFavorites.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
      })
      .addCase(fetchUserGroupFavorites.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        eventsEntity.setAll(state.events, action.payload.events);
        projectsEntity.setAll(state.projects, action.payload.projects);
        contentsEntity.setAll(state.contents, action.payload.contents);
      })
      .addCase(fetchUserGroupFavorites.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.errorMsg = action.error.message || '';
        eventsEntity.setAll(state.events, []);
        projectsEntity.setAll(state.projects, []);
        contentsEntity.setAll(state.contents, []);
      });
  },
});

const { actions, reducer } = userGroupFavoritesSlice;
export const {
  selectAll: selectAllForEvents,
  selectById: selectByIdForEvents,
  selectIds: selectIdsForEvents,
} = eventsEntity.getSelectors(
  (state: RootState) => state.userGroupFavorites.events
);
export const {
  selectAll: selectAllForProjects,
  selectById: selectByIdForProjects,
  selectIds: selectIdsForProjects,
} = projectsEntity.getSelectors(
  (state: RootState) => state.userGroupFavorites.projects
);
export const {
  selectAll: selectAllForContents,
  selectById: selectByIdForContents,
  selectIds: selectIdsForContents,
} = contentsEntity.getSelectors(
  (state: RootState) => state.userGroupFavorites.contents
);
export const selectState = (state: RootState) => state.userGroupFavorites;
export const {
  // events
  addOneWithEvents,
  updateOneWithEvents,
  setOneWithEvents,
  removeOneWithEvents,
  removeAllWithEvents,
  // projects
  addOneWithProjects,
  updateOneWithProjects,
  setOneWithProjects,
  removeOneWithProjects,
  removeAllWithProjects,
  // contents
  addOneWithContents,
  updateOneWithContents,
  setOneWithContents,
  removeOneWithContents,
  removeAllWithContents,
  // common
  removeAllFavorites,
} = actions;
export default reducer;
