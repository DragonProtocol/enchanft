import { ContentsListResponse, URLParseResponse } from '../types/contents';
import request, { RequestPromise } from './request';

// TODO
export function getContentProjects() {
  return request({
    url: `/uniprojects/searching`,
  });
}

// TODO
export function saveContent(token: string) {
  return request({
    url: `/contents`,
    method: 'post',
    data: {
      tittle: 'JavaScript URL 正则怎么写',
      author: '实用前端',
      url: 'https://juejin.cn/post/6844903846766968845',
      type: 'READS',
      uniProjectId: 1,
    },
    headers: {
      token,
      needToken: true,
    },
  });
}

export function contentParse(url: string): RequestPromise<URLParseResponse> {
  return request({
    url: `/contents/parser?url=${url}`,
  });
}

export function favorsContent(id: number, token: string) {
  return request({
    url: `/contents/${id}/favors`,
    method: 'post',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function voteContent(id: number, token: string) {
  return request({
    url: `/contents/${id}/votes`,
    method: 'post',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function fetchContents(
  query: {
    keywords?: string;
    type?: string;
    orderBy?: string;
    pageSize?: number;
    pageNumber?: number;
  },
  token?: string
): RequestPromise<ContentsListResponse> {
  return request({
    url: `/contents/searching`,
    params: {
      pageSize: query.pageSize ?? 0,
      pageNumber: query.pageNumber ?? 10,
      keywords: query.keywords ?? '',
      type: query.type ? query.type.toUpperCase().replace(' ', '_') : '',
      // TODO: wait for backend support
      //   orderBy: query.orderBy
      //     ? query.orderBy.toUpperCase().replace(' ', '')
      //     : '',
    },
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}
