/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-26 10:22:21
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-04 14:46:12
 * @Description: file description
 */
import axios from 'axios';
import { PlatformDataResponse } from '../types/home';
import { ProjectExploreListResponse } from '../types/project';
import request, { RequestPromise } from './request';

export function getPlatforms(): RequestPromise<PlatformDataResponse> {
  return request({
    url: `/uniprojects/platforms`,
  });
}

export function getTrendingContents() {
  return request({
    url: `/contents/searching`,
    params: {
      pageSize: 8,
      pageNumber: 0,
      keywords: '',
      type: '',
      orderBy: 'TRENDING',
    },
    method: 'get',
  });
}

export function getTrendingEvents() {
  return request({
    url: `/events/searching`,
    method: 'get',
    params: {
      pageSize: 14,
      pageNumber: 0,
      keywords: '',
      type: '',
      orderBy: 'TRENDING',
    },
  });
}

export function getTrendingProjects(): RequestPromise<ProjectExploreListResponse> {
  return request({
    url: `/uniProjects/searching`,
    params: {
      pageSize: 4,
      pageNumber: 0,
      keywords: '',
      type: '',
      orderBy: 'TRENDING',
    },
    method: 'get',
  });
}
