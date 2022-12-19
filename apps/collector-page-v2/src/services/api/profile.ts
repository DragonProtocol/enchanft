import { ProfileResponse } from '../types/profile';
import request, { RequestPromise } from './request';

export function fetchU3Profile(token: string): RequestPromise<ProfileResponse> {
  return request({
    url: `/users/u3profile?chain=eth`,
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function fetchU3ProfileWithWallet(wallet: string) {
  return request({
    url: `/users/u3profile/${wallet}`,
    method: 'get',
  });
}
