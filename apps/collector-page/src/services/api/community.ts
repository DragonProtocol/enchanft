/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-08 19:10:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-08 10:20:26
 * @Description: file description
 */
import { AxiosPromise } from 'axios';
import request from '../../request/axios';
import { ApiResp } from '../../types';
import {
  CommunityBasicInfoResponse,
  CommunityCheckinResponse,
  CommunityContributionRankResponse,
  FollowedCommunitiesResponse,
  UserContributionResponse,
  VerifyCommunityCheckinResponse,
} from '../../types/api';
/** 获取社区基本信息 */
export function fetchDetailByCommunityBasicInfo(
  slug: string
): AxiosPromise<ApiResp<CommunityBasicInfoResponse>> {
  return request({
    url: `/projects/${slug}/community`,
    method: 'get',
  });
}

/** 获取 社区贡献值排行 列表 */
export function fetchListForCommunityContributionRank(
  slug: string
): AxiosPromise<ApiResp<CommunityContributionRankResponse>> {
  return request({
    url: `/projects/${slug}/contribution-rank`,
    method: 'get',
  });
}

/** 获取用户在此社区的贡献信息 */
export function fetchOneByUserCommunityContributionRank(
  id: number
): AxiosPromise<ApiResp<UserContributionResponse>> {
  return request({
    url: `/communities/${id}/contribution`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}

/** 获取用户在此社区的积分 */
export function fetchOneByUserCommunityScore(
  slug: string
): AxiosPromise<ApiResp<number>> {
  return request({
    url: `/projects/${slug}/contribution`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}

/** 加入社区 */
export type FollowCommunityParams = {
  id: number;
};
export function followCommunity(
  params: FollowCommunityParams
): AxiosPromise<ApiResp<any>> {
  const { id } = params;
  return request({
    url: `/communities/${id}/followers`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}

/** 社区签到 */
export function checkinCommunity(
  id: number
): AxiosPromise<ApiResp<CommunityCheckinResponse>> {
  return request({
    url: `/engagements/${id}/checkin`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}
/** 验证今日是否签到 */
export function verifyCommunityCheckin(
  id: number
): AxiosPromise<ApiResp<VerifyCommunityCheckinResponse>> {
  return request({
    url: `/engagements/${id}/checkin`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}

/** 获取 我加入的社区 列表 */
export function fetchListForUserFollowedCommunity(): AxiosPromise<
  ApiResp<FollowedCommunitiesResponse>
> {
  return request({
    url: `/communities/followed`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}

/** 下载contributions token */
export function downloadContributions(
  communityId: string | number
): AxiosPromise<any> {
  return request({
    url: `/communities/download/${communityId}.csv`,
    method: 'get',
    responseType: 'blob',
    headers: {
      needToken: true,
    },
  });
}
