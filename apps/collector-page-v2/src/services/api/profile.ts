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

export function fetchU3Profiles(token: string) {
  return request({
    url: `/users/u3profiles`,
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

export function addOrDelWallet(addr: string, add: boolean, token: string) {
  return request({
    url: `/users/wallets`,
    method: 'post',
    data: {
      addRemove: add,
      wallet: addr,
      chain: 'eth',
    },
    headers: {
      token,
      needToken: true,
    },
  });
}

export function fetchU3Wallets(token: string) {
  return request({
    url: `/users/wallets`,
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}
