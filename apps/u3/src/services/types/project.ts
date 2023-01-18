/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 13:06:35
 * @Description: file description
 */
import type { ApiResp } from '.';
import type { OrderBy, ProjectType } from './common';
import { ContentListItem } from './contents';
import type { EventExploreListItemResponse } from './event';

export enum UniProjectType {
  DEFI = 'DEFI',
  GAME = 'GAME',
  DAO = 'DAO',
  NFTS = 'NFTS',
}
export type ProjectEntity = {
  id: number;
  name: string;
  description: string;
  image: string;
};
export type ProjectExploreListParams = {
  keywords?: string;
  orderBy?: OrderBy | '';
  type?: ProjectType | '';
  types?: string[];
  chains?: string[];
  pageSize?: number;
  pageNumber?: number;
  projectId?: number;
};
export type ProjectExploreListItemEventResponse = Omit<
  EventExploreListItemResponse,
  'project'
>;
export type ProjectExploreListItemContentResponse = Omit<
  ContentListItem,
  'uniProject'
>;
export type ProjectExploreListItemResponse = {
  id: number;
  name: string;
  description: string;
  image: string;
  favored?: boolean;
  events?: ProjectExploreListItemEventResponse[];
  contents?: ProjectExploreListItemContentResponse[];
  url: string;
};
export type ProjectExploreListResponse = ApiResp<
  Array<ProjectExploreListItemResponse>
>;
export type ProjectFavoriteListItemResponse = ProjectExploreListItemResponse;
export type ProjectFavoriteListResponse = ApiResp<
  Array<ProjectFavoriteListItemResponse>
>;
export type ProjectFavorHandleResponse = ApiResp<unknown>;
export type FetchOneProjectResponse = ApiResp<ProjectExploreListItemResponse>;
