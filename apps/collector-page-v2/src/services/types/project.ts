/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-15 14:41:20
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
  events?: ProjectExploreListItemEventResponse[];
  contents?: ProjectExploreListItemContentResponse[];
};
export type ProjectExploreListResponse = ApiResp<
  Array<ProjectExploreListItemResponse>
>;
export type ProjectFavoriteListItemResponse = ProjectExploreListItemResponse;
export type ProjectFavoriteListResponse = ApiResp<
  Array<ProjectFavoriteListItemResponse>
>;
export type ProjectFavorHandleResponse = ApiResp<unknown>;
