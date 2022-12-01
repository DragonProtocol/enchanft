/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-01 11:05:44
 * @Description: file description
 */
import { EventExploreListResponse } from '../types/event';
import request, { RequestPromise } from './request';

export function fetchListForEvent(): RequestPromise<EventExploreListResponse> {
  return request({
    url: `/events/searching`,
    method: 'get',
  });
}
