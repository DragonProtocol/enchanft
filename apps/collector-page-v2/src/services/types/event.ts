/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-30 10:25:12
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 17:47:45
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
  chain: EventChain;
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
  chain: EventChain;
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
  chain: EventChain;
  reward: Reward;
  startTime: number;
  endTime: number;
  supportIframe: boolean;
};
export type CreateEventResponse = ApiResp<unknown>;
