import axios from 'axios';
import {
  ContentsListResponse,
  ContentsResponse,
  ContentType,
  URLParseResponse,
} from '../types/contents';
import request, { RequestPromise } from './request';

export function getContentProjects(): RequestPromise<ContentsResponse> {
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
    supportReaderView?: boolean;
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
      supportReaderView: data.supportReaderView || false,
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

export function personalFavors(uuid: string, token: string) {
  return request({
    url: `/contents/${uuid}/personalfavors`,
    method: 'post',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function personalVote(uuid: string, token: string) {
  return request({
    url: `/contents/${uuid}/personalvotes`,
    method: 'post',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function personalComplete(uuid: string, token: string) {
  return request({
    url: `/contents/${uuid}/personalcompleting`,
    method: 'post',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function complete(id: number, token: string) {
  return request({
    url: `/contents/${id}/completing`,
    method: 'post',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function fetchDaylight(
  cursor: string,
  wallet = '0xee3ca4dd4ceb3416915eddc6cdadb4a6060434d4'
) {
  if (cursor) {
    return axios.get(
      `https://api.daylight.xyz/v1/wallets/${wallet}/abilities?type=result&type=article&sortDirection=desc&sort=magic&limit=10&after=${cursor}`
    );
  }
  return axios.get(
    `https://api.daylight.xyz/v1/wallets/${wallet}/abilities?type=result&type=article&sortDirection=desc&sort=magic&limit=10`
  );
}

export function fetchContents(
  query: {
    keywords?: string;
    type?: string;
    orderBy?: string;
    pageSize?: number;
    pageNumber?: number;
    contentId?: string;
  },
  token?: string
): RequestPromise<ContentsListResponse> {
  return request({
    url: `/contents/searching`,
    params: {
      userId: 84,
      contentId: query.contentId === ':id' ? null : query.contentId,
      pageSize: query.pageSize ?? 10,
      pageNumber: query.pageNumber ?? 0,
      keywords: query.keywords ?? '',
      type: query.type ? query.type.toUpperCase().replace(' ', '_') : '',
      orderBy: query.orderBy
        ? query.orderBy.toUpperCase().replace(' ', '')
        : '',
    },
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}
