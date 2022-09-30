/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 16:51:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-29 19:20:14
 * @Description: file description
 */
import axios, { AxiosPromise } from 'axios';
import qs from 'qs';
const ApiBaseUrl = process.env['REACT_APP_API_BASE_URL'];

export type ApiResp<T> = {
  code: number;
  msg: string;
  data: T;
};

export enum AccountType {
  SOLANA = 'SOLANA',
  EVM = 'EVM',
  APTOS = 'APTOS',
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
}

export enum AsyncRequestStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

export type AccountLink = {
  accountType: AccountType;
  id: 187;
  thirdpartyId: '3VBhW51tUBzZfWpSv5fcZww3sMtcPoYq55k38rWPFsvi';
  thirdpartyName: '';
  userId: 63;
};
export type LoginResult = {
  token: string;
  id: number;
  name: string;
  avatar: string;
  accounts: AccountLink[];
  roles: ['COLLECTOR'];
  resourcePermissions: [];
};
export function login(params: {
  signature: string;
  payload: string;
  pubkey: string;
  type: AccountType;
}): AxiosPromise<LoginResult> {
  console.log('loginParams', params);
  return axios({
    url: `${ApiBaseUrl}/users/login`,
    method: 'post',
    data: params,
  });
}

export function linkAccount(
  params: {
    type: AccountType;
    signature: string;
    payload: string;
    pubkey: string;
  },
  token: string
) {
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
