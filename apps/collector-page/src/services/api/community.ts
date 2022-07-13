/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-08 19:10:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-13 14:24:39
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import { CommunityCollectionResponse, CommunityContributionRankResponseItem } from '../../types/api'

/** 获取 collection 详情 */
export type fetchDetailForCommunityCollectionParams = {
  communityId: number
}
export function fetchDetailForCommunityCollection(
  params: fetchDetailForCommunityCollectionParams,
): AxiosPromise<ApiResp<CommunityCollectionResponse>> {
  return request({
    url: `/communities/${params.communityId}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}

/** 获取 contributionrank 列表 */
export type fetchListForCommunityContributionRankParams = {
  communityId: number
}
export function fetchListForCommunityContributionRank(
  params: fetchListForCommunityContributionRankParams,
): AxiosPromise<ApiResp<CommunityContributionRankResponseItem[]>> {
  return request({
    url: `/communities/${params.communityId}/contribution-rank`,
    method: 'get',
  })
}
