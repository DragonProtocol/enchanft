/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 16:51:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-12 18:42:52
 * @Description: file description
 */
import axios, { AxiosPromise } from 'axios';
import qs from 'qs';
import {
  Account,
  AccountType,
  ResourcePermission,
  RoleType,
  User,
} from './types';
const API_BASE_URL = process.env['REACT_APP_API_BASE_URL'];
const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = API_BASE_URL;
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
type HandleAccountParamsForWeb3Account = {
  type: AccountType;
  signature: string;
  payload: string;
  pubkey: string;
};
// login ==================================
type LoginParamsForTwitterAccount = {
  type: AccountType;
  twitterOauthToken: string;
  twitterOauthVerifier: string;
};
type LoginParamsForDiscordAccount = {
  type: AccountType;
  code: string;
};
type LoginParamsMap = {
  [AccountType.TWITTER]: LoginParamsForTwitterAccount;
  [AccountType.DISCORD]: LoginParamsForDiscordAccount;
  [AccountType.EVM]: HandleAccountParamsForWeb3Account;
  [AccountType.SOLANA]: HandleAccountParamsForWeb3Account;
  [AccountType.APTOS]: HandleAccountParamsForWeb3Account;
};
export type LoginResult = {
  token: string;
  id: number;
  name: string;
  avatar: string;
  accounts: Account[];
  roles: RoleType[];
  resourcePermissions: ResourcePermission[];
};
export function login<K extends keyof LoginParamsMap>(
  params: { type: K } & LoginParamsMap[K]
): AxiosPromise<ApiResp<LoginResult>> {
  const data = qs.stringify(params);
  return axiosInstance({
    url: `/users/login`,
    method: 'post',
    data: params,
  });
}

// bind ==================================
type BindAccountParamsForTwitterAccount = {
  type: AccountType;
  code: string;
};
type BindAccountParamsForDiscordAccount = {
  type: AccountType;
  code: string;
};
type BindAccountParamsMap = {
  [AccountType.TWITTER]: BindAccountParamsForTwitterAccount;
  [AccountType.DISCORD]: BindAccountParamsForDiscordAccount;
  [AccountType.EVM]: HandleAccountParamsForWeb3Account;
  [AccountType.SOLANA]: HandleAccountParamsForWeb3Account;
  [AccountType.APTOS]: HandleAccountParamsForWeb3Account;
};

export type BindResult = Account[];
export function bindAccount<K extends keyof BindAccountParamsMap>(
  token: string,
  params: { type: K } & BindAccountParamsMap[K]
): AxiosPromise<ApiResp<BindResult>> {
  const data = qs.stringify(params);
  return axiosInstance({
    url: '/users/link',
    method: 'post',
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// unbind ==================================
export type UnBindResult = Account[];
export function unbindAccount(
  token: string,
  type: AccountType
): AxiosPromise<ApiResp<UnBindResult>> {
  const data = qs.stringify({ type });
  return axiosInstance({
    url: '/users/link',
    method: 'post',
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// get user info ==================================
export type GetUserInfoResult = User;
export function getUserInfo(
  token: string
): AxiosPromise<ApiResp<GetUserInfoResult>> {
  return axiosInstance({
    url: '/users/profile',
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// get twittier oauth1 request token ==================================
type GetTwitterOauth1RequestTokenResult = {
  oauthToken: string;
  oauthTokenSecret: string;
};
export function getTwittierOauth1RequestToken(
  callbackUri: string
): AxiosPromise<ApiResp<GetTwitterOauth1RequestTokenResult>> {
  return axiosInstance({
    url: `/users/twitter/oauth/request_token?callback=${callbackUri}`,
    method: 'get',
  });
}
