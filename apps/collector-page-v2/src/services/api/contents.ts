import { ContentsListResponse } from '../types/contents';
import request, { RequestPromise } from './request';

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
