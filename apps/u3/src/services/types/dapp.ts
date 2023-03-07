/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 17:29:00
 * @Description: file description
 */
import type { ApiResp } from '.';
import type { OrderBy } from './common';
import { ProjectExploreListItemResponse } from './project';

export enum DappStatus {
  HIDDEN = 'HIDDEN',
  VISIBLE = 'VISIBLE',
  VERIFIED = 'VERIFIED',
}

export type DappEntity = {
  id: number;
  name: string;
  description: string;
  image: string;
};
export type DappExploreListParams = {
  keywords?: string;
  orderBy?: OrderBy | '';
  type?: string;
  types?: string[];
  chains?: string[];
  pageSize?: number;
  pageNumber?: number;
  projectId?: number;
};

export type DappExploreListItemResponse = {
  id: number;
  name: string;
  description: string;
  image: string;
  favored?: boolean;
  url: string;
  mediaLinks?: {
    twitter?: string;
    discord?: string;
    facebook?: string;
    telegram?: string;
  };
  types?: string[];
  chains?: string[];
  status?: DappStatus;
  project?: ProjectExploreListItemResponse;
};
export type DappExploreListResponse = ApiResp<
  Array<DappExploreListItemResponse>
>;
export type DappFavoriteListItemResponse = DappExploreListItemResponse;
export type DappFavoriteListResponse = ApiResp<
  Array<DappFavoriteListItemResponse>
>;
export type DappFavorHandleResponse = ApiResp<unknown>;
export type FetchOneDappResponse = ApiResp<DappExploreListItemResponse>;

export type UpdateDappData = {
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
  url: string;
  chains?: string[];
  status?: DappStatus;
  editorScore?: number;
  uniProjectId: number;
};
export type UpdateDappResponse = ApiResp<DappExploreListItemResponse>;