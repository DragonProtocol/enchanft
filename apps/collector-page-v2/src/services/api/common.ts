/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 13:03:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 13:40:50
 * @Description: file description
 */
// 获取所有Platform
import { PlatformsResponse } from '../types/common';
import request, { RequestPromise } from './request';

export function getAllPlatform(): RequestPromise<PlatformsResponse> {
  return request({
    url: `/uniprojects/platforms`,
    method: 'get',
  });
}
