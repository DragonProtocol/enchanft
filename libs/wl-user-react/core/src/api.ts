/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 16:51:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-08 16:40:30
 * @Description: file description
 */
import axios, { AxiosPromise } from 'axios';
import qs from 'qs';
import {
  AccountLink,
  AccountType,
  ResourcePermission,
  RoleType,
} from './types';
const ApiBaseUrl = process.env['REACT_APP_API_BASE_URL'];

export type ApiResp<T> = {
  code: number;
  msg: string;
  data: T;
};

export enum AsyncRequestStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

export type LoginResult = {
  token: string;
  id: number;
  name: string;
  avatar: string;
  pubkey: string;
  accounts: AccountLink[];
  roles: RoleType[];
  resourcePermissions: ResourcePermission[];
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
