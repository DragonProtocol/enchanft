/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 14:31:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-07 07:53:00
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
  EventFavoriteListItemResponse,
  ProjectFavoriteListItemResponse,
  UserGroupFavorites,
} from '../../services/types/favorite';
import type { RootState } from '../../store/store';

type EventsEntityState = EntityState<EventFavoriteListItemResponse>;
type ProjectsEntityState = EntityState<ProjectFavoriteListItemResponse>;
export type GroupFavoritesState = {
  status: AsyncRequestStatus;
  errorMsg: string;
  events: EventsEntityState;
  projects: ProjectsEntityState;
};
export const eventsEntity = createEntityAdapter<EventFavoriteListItemResponse>({
  selectId: (item) => item.id,
});
export const projectsEntity =
  createEntityAdapter<ProjectFavoriteListItemResponse>({
    selectId: (item) => item.id,
  });
const initEventsEntity: EventsEntityState = eventsEntity.getInitialState();
const initProjectsEntity: ProjectsEntityState =
  projectsEntity.getInitialState();
const initGroupFavoritesState: GroupFavoritesState = {
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  events: initEventsEntity,
  projects: initProjectsEntity,
};
export const fetchUserGroupFavorites = createAsyncThunk<
  UserGroupFavorites,
  undefined
>('favorite/userGroupFavorites', async (params, { rejectWithValue }) => {
  const resp = await fetchUserFavoritesByGroup();
  if (resp.data.code === ApiRespCode.SUCCESS) {
    return resp.data.data;
  }
  return rejectWithValue(new Error(resp.data.msg));
});

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

    // common
    removeAllFavorites: (state) => {
      eventsEntity.removeAll(state.events);
      projectsEntity.removeAll(state.projects);
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
      })
      .addCase(fetchUserGroupFavorites.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.errorMsg = action.error.message || '';
        eventsEntity.setAll(state.events, []);
        projectsEntity.setAll(state.projects, []);
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
  // common
  removeAllFavorites,
} = actions;
export default reducer;
