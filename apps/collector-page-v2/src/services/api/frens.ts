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
  });
}
