/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 18:30:38
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
  });
}
export function favorEvent(
  id: number
): RequestPromise<EventFavorHandleResponse> {
  return request({
    url: `/events/${id}/favors`,
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

// TODO :complete 暂时保存到本地
const COMPLETED_EVENTS_STOREAGE_KEY = 'completed_events';
const getStorageCompletedIds = () => {
  try {
    const value = localStorage.getItem(COMPLETED_EVENTS_STOREAGE_KEY);
    const v = JSON.parse(value);
    if (isArray(v)) {
      return v;
    }
    if (isNumber(v)) {
      return [v];
    }
    return [];
  } catch (e) {
    return [];
  }
};
export function completeEvent(id: number): Array<number> {
  const events = getStorageCompletedIds();
  events.push(id);
  localStorage.setItem(COMPLETED_EVENTS_STOREAGE_KEY, JSON.stringify(events));
  return events;
}

export function fetchListForUserCompletedEvents(): Array<number> {
  return getStorageCompletedIds();
}

export type DaylightListParams = {
  pubkey: string;
  after: string;
  limit: number;
};
export function fetchListByDaylight(
  params: DaylightListParams
): AxiosPromise<any> {
  const { pubkey, after, limit } = params;
  return axios.get(
    `https://api.daylight.xyz/v1/wallets/${pubkey}/abilities?type=access&type=mint&type=airdrop&type=claim&type=vote&type=misc&sortDirection=desc&sort=magic&limit=${limit}&after=${after}`
  );
}
