import {
  ContentsListResponse,
  ContentType,
  URLParseResponse,
} from '../types/contents';
import request, { RequestPromise } from './request';

// TODO
export function getContentProjects() {
  return request({
    url: `/uniprojects/searching`,
  });
}

export function saveContent(
  data: {
    title: string;
    author: string;
    url: string;
    types: ContentType;
    uniProjectId: number | Array<number>;
  },
  token: string
) {
  return request({
    url: `/contents`,
    method: 'post',
    data: {
      title: data.title,
      author: data.author,
      url: data.url,
      type: data.types.toUpperCase().replace(' ', '_'),
      uniProjedctId: data.uniProjectId,
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
