import axios from 'axios';
import {
  ContentsListResponse,
  ContentsResponse,
  ContentType,
  URLParseResponse,
} from '../types/contents';
import request, { RequestPromise } from './request';

export function getFeed(): RequestPromise<ContentsResponse> {
  return request({
    url: `/frens/feed`,
  });
}
