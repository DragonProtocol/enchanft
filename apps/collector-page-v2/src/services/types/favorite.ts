/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 14:23:23
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-06 15:29:10
 * @Description: file description
 */
import { ApiResp } from '.';
import { EventExploreListItemResponse } from './event';
import { ProjectExploreListItemResponse } from './project';

export type EventFavoriteListItemResponse = EventExploreListItemResponse;
export type ProjectFavoriteListItemResponse = ProjectExploreListItemResponse;
export type UserGroupFavorites = {
  events: Array<EventExploreListItemResponse>;
  projects: Array<ProjectFavoriteListItemResponse>;
};
export type UserGroupFavoritesResponse = ApiResp<UserGroupFavorites>;
