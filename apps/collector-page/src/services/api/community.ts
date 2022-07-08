/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-08 19:10:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-08 19:54:56
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
export const fetchDetailForCommunityCollectionUrl = '/community/detail'
export function fetchDetailForCommunityCollection(
  params: fetchDetailForCommunityCollectionParams,
): AxiosPromise<ApiResp<CommunityCollectionResponse>> {
  return request({
    url: fetchDetailForCommunityCollectionUrl,
    method: 'get',
    headers: {
      needToken: true,
    },
    params,
  })
}

/** 获取 contributionrank 列表 */
export type fetchListForCommunityContributionRankParams = {
  communityId: number
}
export const fetchListForCommunityContributionRankUrl = '/community/contributionrank'
export function fetchListForCommunityContributionRank(
  params: fetchListForCommunityContributionRankParams,
): AxiosPromise<ApiResp<CommunityContributionRankResponseItem[]>> {
  return request({
    url: fetchListForCommunityContributionRankUrl,
    method: 'get',
    params,
  })
}
