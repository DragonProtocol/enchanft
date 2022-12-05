/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 17:17:24
 * @Description: file description
 */
import qs from 'qs';
import {
  ProjectExploreListParams,
  ProjectExploreListResponse,
  ProjectFavorHandleResponse,
} from '../types/project';
import request, { RequestPromise } from './request';

export function fetchListForProjectExplore(
  params: ProjectExploreListParams
): RequestPromise<ProjectExploreListResponse> {
  return request({
    url: `/uniProjects/searching`,
    method: 'get',
    params,
  });
}
export function favorProject(
  id: number
): RequestPromise<ProjectFavorHandleResponse> {
  return request({
    url: `/uniProjects/${id}/favors`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}
