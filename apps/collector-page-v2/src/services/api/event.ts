/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-23 18:22:42
 * @Description: file description
 */
import axios, { AxiosPromise } from 'axios';
import { isArray, isNumber } from 'lodash';
import qs from 'qs';
import {
  CreateEventData,
  CreateEventResponse,
  EventExploreListParams,
  EventExploreListResponse,
  EventFavorHandleResponse,
} from '../types/event';
import request, { RequestPromise } from './request';

export function fetchListForEventExplore(
  params: EventExploreListParams
): RequestPromise<EventExploreListResponse> {
  return request({
    url: `/events/searching`,
    method: 'get',
    params,
    headers: {
      needToken: true,
    },
  });
}
export function fetchListForEventComplete(
  params: EventExploreListParams
): RequestPromise<EventExploreListResponse> {
  return request({
    url: `/events/completings`,
    method: 'get',
    params,
    headers: {
      needToken: true,
    },
  });
}
export function favorEvent({
  id,
  uuid,
  isForU,
}: {
  id: number | string;
  uuid: string;
  isForU: boolean;
}): RequestPromise<EventFavorHandleResponse> {
  return request({
    url: isForU ? `/events/${uuid}/personlfavors` : `/events/${id}/favors`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}
export function createEvent(
  data: CreateEventData
): RequestPromise<CreateEventResponse> {
  return request({
    url: `/events`,
    method: 'post',
    data,
    headers: {
      needToken: true,
    },
  });
}

export function completeEvent({
  id,
  uuid,
  isForU,
}: {
  id: number | string;
  uuid: string;
  isForU: boolean;
}): RequestPromise<EventFavorHandleResponse> {
  return request({
    url: isForU
      ? `/events/${uuid}/personlcompleting`
      : `/events/${id}/completing`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}

// TODO 获取用户完成的events
export function fetchListForEventCompletedList(): Array<number> {
  return [];
}

// export type DaylightListParams = {
//   pubkey: string;
//   after: string;
//   limit: number;
// };
// export function fetchListByDaylight(
//   params: DaylightListParams
// ): AxiosPromise<any> {
//   const { pubkey, after, limit } = params;
//   return axios.get(
//     `https://api.daylight.xyz/v1/wallets/${pubkey}/abilities?type=access&type=mint&type=airdrop&type=claim&type=vote&type=misc&sortDirection=desc&sort=magic&limit=${limit}&after=${after}`
//   );
// }
