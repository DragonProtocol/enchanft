/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-08 19:10:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-15 15:57:28
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import {
  CommunityCollectionResponse,
  CommunityContributionRankResponseItem,
  FollowedCommunitiesResponse,
} from '../../types/api'

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

/** 获取 社区贡献值排行 列表 */
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

/** 加入社区 */
export type FollowCommunityParams = {
  id: number
}
export function followCommunity(params: FollowCommunityParams): AxiosPromise<ApiResp<any>> {
  const { id } = params
  return request({
    url: `/communities/${id}/followers`,
    method: 'post',
    headers: {
      needToken: true,
    },
  })
}

/** 获取 我加入的社区 列表 */
export function fetchListForUserFollowedCommunity(): AxiosPromise<ApiResp<FollowedCommunitiesResponse>> {
  return request({
    url: `/communities/followed`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}
