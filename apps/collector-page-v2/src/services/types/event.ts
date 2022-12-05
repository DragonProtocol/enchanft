/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-30 10:25:12
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 19:08:53
 * @Description: file description
 */
import { ApiResp } from '.';
import { OrderBy, Platform, ProjectType, Reward } from './common';

export enum EventChain {
  ETH = 'ETH',
  SOLANA = 'SOLANA',
}
export type EventEntity = {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  chain: string;
  startTime: number;
  endTime: number;
  reward: Reward;
};
export type EventExploreListParams = {
  keywords?: string;
  platform?: Platform | '';
  reward?: Reward | '';
  projectType?: ProjectType | '';
  orderBy?: OrderBy | '';
  pageSize?: number;
  pageNumber?: number;
};

export type EventExploreListItemResponse = {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  chain: string;
  startTime: number;
  endTime: number;
  reward: Reward;
  project: {
    id: number;
    name: string;
    description: string;
    image: string;
  };
  platform: {
    logo: string;
  };
};
export type EventExploreListResponse = ApiResp<
  Array<EventExploreListItemResponse>
>;
export type EventFavoriteListItemResponse = EventExploreListItemResponse;
export type EventFavoriteListResponse = ApiResp<
  Array<EventFavoriteListItemResponse>
>;
export type EventFavorHandleResponse = ApiResp<unknown>;
