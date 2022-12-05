/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 16:16:13
 * @Description: file description
 */
import qs from 'qs';
import {
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

// TODO :complete 暂时保存到本地
const COMPLETED_EVENTS_STOREAGE_KEY = 'completed_events';
export function completeEvent(id: number): Array<number> {
  const value = localStorage.getItem(COMPLETED_EVENTS_STOREAGE_KEY);
  let events = [];
  try {
    events = JSON.parse(value).push(id);
    return events;
  } catch (e) {
    events = [id];
    return events;
  } finally {
    localStorage.setItem(COMPLETED_EVENTS_STOREAGE_KEY, JSON.stringify(events));
  }
}

export function fetchListForUserCompletedEvents(): Array<number> {
  const value = localStorage.getItem(COMPLETED_EVENTS_STOREAGE_KEY);
  try {
    return JSON.parse(value);
  } catch (e) {
    return [];
  }
}
