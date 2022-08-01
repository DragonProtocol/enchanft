/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-29 17:10:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-29 19:01:34
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import { ProjectDetailResponse, ProjectContributionRankResponseItem } from '../../types/api'

export function fetchDetailByProjectSlug(slug: string): AxiosPromise<ApiResp<ProjectDetailResponse>> {
  return request({
    url: `/projects/${slug}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}

/** 获取 项目贡献值排行 列表 */
export type fetchListForProjectContributionRankParams = {
  id: number
}
export function fetchListForProjectContributionRank(
  params: fetchListForProjectContributionRankParams,
): AxiosPromise<ApiResp<ProjectContributionRankResponseItem[]>> {
  return request({
    url: `/communities/${params.id}/contribution-rank`,
    method: 'get',
  })
}
