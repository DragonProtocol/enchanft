import axios from 'axios';
import {
  ContentsListResponse,
  ContentsResponse,
  ContentType,
  URLParseResponse,
} from '../types/contents';
import request, { RequestPromise } from './request';

export function getFeed(params): RequestPromise<ContentsResponse> {
  return request({
    url: `/frens/feed`,
    method: 'get',
    params,
    headers: {
      needToken: true,
    },
  });
}

export function search(params): RequestPromise<ContentsResponse> {
  return request({
    url: `/frens/search/${params?.address}`,
    method: 'get',
    params,
    headers: {
      needToken: true,
    },
  });
}

export function follow(params): RequestPromise<ContentsResponse> {
  return request({
    url: `/frens/follow`,
    method: 'post',
    params,
    headers: {
      needToken: true,
    },
  });
}

export function unFollow(params): RequestPromise<ContentsResponse> {
  return request({
    url: `/frens/unfollow`,
    method: 'post',
    params,
    headers: {
      needToken: true,
    },
  });
}

export function following(params): RequestPromise<ContentsResponse> {
  return request({
    url: `/frens/following`,
    method: 'get',
    params,
    headers: {
      needToken: true,
    },
  });
}

export function follower(params): RequestPromise<ContentsResponse> {
  return request({
    url: `/frens/follower`,
    method: 'get',
    params,
    headers: {
      needToken: true,
    },
  });
}

export function reco(params): RequestPromise<ContentsResponse> {
  return request({
    url: `/frens/reco`,
    method: 'get',
    params,
    headers: {
      needToken: true,
    },
  });
}
