/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-06 13:45:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-25 14:30:34
 * @Description: explore projects and tasks api
 */
import { AxiosPromise } from 'axios';
import request from '../../request/axios';
import { ApiResp } from '../../types';
import {
  ExploreRecommendProjectItem,
  ExploreRecommendTaskItem,
  ExploreSearchProjectItem,
  ExploreSearchProjectsRequestParams,
  ExploreSearchTaskItem,
  ExploreSearchTasksRequestParams,
} from '../../types/api';

export function fetchListForSearchTasks(
  params: ExploreSearchTasksRequestParams
): AxiosPromise<ApiResp<ExploreSearchTaskItem[]>> {
  return request({
    url: '/tasks/searching',
    method: 'get',
    params,
  });
}
export function fetchListForRecommendTasks(): AxiosPromise<
  ApiResp<ExploreRecommendTaskItem[]>
> {
  return request({
    url: '/tasks/recommendation',
    method: 'get',
  });
}

export function fetchListForSearchProjects(
  params: ExploreSearchProjectsRequestParams
): AxiosPromise<ApiResp<ExploreSearchProjectItem[]>> {
  return request({
    url: '/projects',
    method: 'get',
    params,
  });
}
export function fetchListForRecommendProjects(): AxiosPromise<
  ApiResp<ExploreRecommendProjectItem[]>
> {
  return request({
    url: '/projects/recommendation',
    method: 'get',
  });
}
