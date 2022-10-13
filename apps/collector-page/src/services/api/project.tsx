/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-29 17:10:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-06 16:56:49
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import { ProjectDetailResponse } from '../../types/api'

export function fetchDetailByProjectSlug(slug: string): AxiosPromise<ApiResp<ProjectDetailResponse>> {
  return request({
    url: `/projects/${slug}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}
