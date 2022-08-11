/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-08 19:10:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-11 11:15:04
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import {
  CommunityBasicInfoResponse,
  CommunityCollectionResponse,
  CommunityContributionRankResponse,
  FollowedCommunitiesResponse,
  UserContributionResponse,
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
/** 获取社区基本信息 */
export function fetchDetailByCommunityBasicInfo(slug: string): AxiosPromise<ApiResp<CommunityBasicInfoResponse>> {
  return request({
    url: `/projects/${slug}/community`,
    method: 'get',
  })
}

/** 获取 社区贡献值排行 列表 */
export function fetchListForCommunityContributionRank(
  slug: string,
): AxiosPromise<ApiResp<CommunityContributionRankResponse>> {
  return request({
    url: `/projects/${slug}/contribution-rank`,
    method: 'get',
  })
}

/** 获取用户在此社区的贡献信息 */
export function fetchOneByUserCommunityContributionRank(id: number): AxiosPromise<ApiResp<UserContributionResponse>> {
  return request({
    url: `/communities/${id}/contribution`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}

/** 获取用户在此社区的积分 */
export function fetchOneByUserCommunityScore(slug: string): AxiosPromise<ApiResp<number>> {
  return request({
    url: `/projects/${slug}/contribution`,
    method: 'get',
    headers: {
      needToken: true,
    },
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
