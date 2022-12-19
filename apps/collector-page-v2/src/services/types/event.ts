/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-30 10:25:12
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-19 18:30:42
 * @Description: file description
 */
import { ApiResp } from '.';
import { ChainType } from '../../utils/chain';
import { OrderBy, Platform, ProjectType, Reward } from './common';

export type EventEntity = {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  chain: ChainType;
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
  eventId?: number;
};

export type EventExploreListItemResponse = {
  uid?: string;
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  chain: ChainType;
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
    name: string;
    logo: string;
  };
  supportIframe: boolean;
};
export type EventExploreListResponse = ApiResp<
  Array<EventExploreListItemResponse>
>;
export type EventFavorHandleResponse = ApiResp<unknown>;

export type CreateEventData = {
  name: string;
  description: string;
  image: string;
  platform: Platform;
  project: number;
  link: string;
  chain: ChainType;
  reward: Reward;
  startTime: number;
  endTime: number;
  supportIframe: boolean;
};
export type CreateEventResponse = ApiResp<unknown>;
