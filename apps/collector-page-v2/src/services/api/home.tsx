import axios from 'axios';
import { ContentsListResponse } from '../types/contents';
import { EventExploreListResponse } from '../types/event';
import { PlatformDataResponse } from '../types/home';
import { ProjectExploreListResponse } from '../types/project';
import request, { RequestPromise } from './request';

export function getPlatforms(): RequestPromise<PlatformDataResponse> {
  return request({
    url: `/uniprojects/platforms`,
  });
}

// TODO remove default wallet
export function getRecommendedContents(
  wallet = '0xee3ca4dd4ceb3416915eddc6cdadb4a6060434d4'
) {
  return axios.get(
    `https://api.daylight.xyz/v1/wallets/${wallet}/abilities?type=result&type=article&sortDirection=desc&sort=magic&limit=4`
  );
}

// TODO remove default wallet
export function getRecommendedEvents(
  wallet = '0xee3ca4dd4ceb3416915eddc6cdadb4a6060434d4'
) {
  return axios.get(
    `https://api.daylight.xyz/v1/wallets/${wallet}/abilities?type=access&type=mint&type=airdrop&type=claim&type=vote&type=misc&sortDirection=desc&sort=magic&limit=4`
  );
}

export function getTrendingContents(): RequestPromise<ProjectExploreListResponse> {
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
