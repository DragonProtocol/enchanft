/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 17:44:47
 * @Description: file description
 */
import type { ApiResp } from '.';
import type { OrderBy, ProjectType } from './common';
import { ContentListItem } from './contents';
import type { EventExploreListItemResponse } from './event';

export enum UniprojectStatus {
  HIDDEN = 'HIDDEN',
  VISIBLE = 'VISIBLE',
  VERIFIED = 'VERIFIED',
}
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

export type ProjectExploreListItemResponse = {
  id: number;
  name: string;
  description: string;
  image: string;
  favored?: boolean;
  events?: EventExploreListItemResponse[];
  contents?: ContentListItem[];
  url: string;
  mediaLinks?: {
    twitter?: string;
    discord?: string;
    facebook?: string;
    telegram?: string;
  };
  types?: string[];
  dappUrl: string;
  chains?: string[];
  status?: UniprojectStatus;
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

export type UpdateProjectData = {
  name: string;
  description: string;
  image: string;
  mediaLinks?: {
    twitter?: string;
    discord?: string;
    facebook?: string;
    telegram?: string;
  };
  types?: string[];
  dappUrl: string;
  url: string;
  chains?: string[];
  status?: UniprojectStatus;
  editorScore?: number;
};
export type UpdateProjectResponse = ApiResp<unknown>;
