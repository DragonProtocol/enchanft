import axios from 'axios';
import {
  ContentLang,
  ContentsListResponse,
  ContentsResponse,
  ContentStatus,
  ContentType,
  URLParseResponse,
} from '../types/contents';
import request, { RequestPromise } from './request';

export function getContentProjects(): RequestPromise<ContentsResponse> {
  return request({
    url: `/uniprojects/searching`,
  });
}

export function getContent(id: number | string, token: string) {
  return request({
    url: `/contents/${id}`,
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function saveContent(
  data: {
    title: string;
    author: string;
    url: string;
    type: ContentType;
    lang: ContentLang;
    uniProjectIds: Array<number>;
    supportReaderView?: boolean;
    supportIframe?: boolean;
    adminScore?: number;
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
      type: data.type.toUpperCase().replace(' ', '_'),
      lang: data.lang === ContentLang.All ? null : data.lang,
      uniProjectIds: data.uniProjectIds,
      supportReaderView: data.supportReaderView || false,
      supportIframe: data.supportIframe || false,
      adminScore: data.adminScore,
    },
    headers: {
      token,
      needToken: true,
    },
  });
}

export function updateContent(
  data: {
    id: number;
    title?: string;
    author?: string;
    url?: string;
    type?: ContentType;
    lang?: ContentLang;
    uniProjectIds?: Array<number>;
    supportReaderView?: boolean;
    supportIframe?: boolean;
    adminScore?: number;
    status?: ContentStatus;
  },
  token: string
) {
  return request({
    url: `/contents/${data.id}`,
    method: 'post',
    data: {
      title: data.title,
      author: data.author,
      url: data.url,
      type: data.type?.toUpperCase().replace(' ', '_') ?? undefined,
      lang: data.lang === ContentLang.All ? undefined : data.lang,
      uniProjectIds: data.uniProjectIds ?? undefined,
      supportReaderView: data.supportReaderView,
      supportIframe: data.supportIframe,
      adminScore: data.adminScore || undefined,
      status: data.status || undefined,
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

export function delFavors(id: number, token: string) {
  return request({
    url: `/contents/${id}/favors`,
    method: 'delete',
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
    lang?: string;
  },
  token?: string
): RequestPromise<ContentsListResponse> {
  return request({
    url: `/contents/searching`,
    params: {
      lang: query.lang === ContentLang.All ? null : query.lang,
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
