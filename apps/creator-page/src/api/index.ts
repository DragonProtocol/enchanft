import axios, { AxiosPromise } from 'axios';
import qs from 'qs';

const ApiBaseUrl = process.env.REACT_APP_API_BASE_URL;
console.log({ ApiBaseUrl });

export type ApiResp<T> = {
  code: number;
  msg: string;
  data: T;
};

export enum ChainType {
  SOLANA = 'SOLANA',
  EVM = 'EVM',
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
}

type Account = {
  accountType: 'SOLANA' | 'EVM' | any;
  thirdpartyId: string;
  thirdpartyName: string;
};

export type LoginResult = {
  token: string;
  id: number;
  name: string;
  avatar: string;
  accounts: [Account];
  roles: ['COLLECTOR'];
  resourcePermissions: [];
};
export function login(params: {
  signature: string;
  payload: string;
  pubkey: string;
  type: ChainType;
}): AxiosPromise<LoginResult> {
  // console.log('loginParams', params)
  const data = qs.stringify(params);
  return axios({
    url: `${ApiBaseUrl}/users/login`,
    method: 'post',
    data: data,
  });
}

export function getProfile(token: string): AxiosPromise<ApiResp<LoginResult>> {
  return axios({
    url: ApiBaseUrl + '/users/profile',
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function uploadImage(file: File, token: string) {
  const form = new FormData();
  form.append('file', file);
  return axios({
    url: ApiBaseUrl + '/medium/upload',
    method: 'post',
    data: form,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function checkTweetIdValid(tweetId: string, token: string) {
  return axios({
    url: ApiBaseUrl + `/users/twitter?tweetId=${tweetId}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function checkTwitterNameValid(name: string, token: string) {
  return axios({
    url: ApiBaseUrl + `/users/twitter?name=${name}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function linkAccount(params: any, token: string) {
  const data = qs.stringify(params);
  return axios({
    url: ApiBaseUrl + '/users/link',
    method: 'post',
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function fetchDetailByProjectSlug(
  slug: string,
  token: string
): AxiosPromise<ApiResp<any>> {
  return axios({
    url: ApiBaseUrl + `/projects/${slug}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
