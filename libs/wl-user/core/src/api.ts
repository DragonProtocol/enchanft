/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 16:51:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-25 14:58:39
 * @Description: file description
 */
import axios, { AxiosPromise } from 'axios';
import * as qs from 'qs';
export enum AccountType {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  SOLANA = 'SOLANA',
  EVM = 'EVM',
  APTOS = 'APTOS',
}

export enum RoleType {
  CREATOR = 'CREATOR',
  COLLECTOR = 'COLLECTOR',
  ADMIN = 'ADMIN',
  VIP = 'VIP',
}

export enum ResourceType {
  TASK = 'TASK',
  PROJECT = 'PROJECT',
  COMMUNITY = 'COMMUNITY',
}

export type ResourcePermission = {
  resourceType: ResourceType;
  resourceIds: number[];
};

export type Account = {
  id: number;
  accountType: AccountType;
  thirdpartyId: string;
  thirdpartyName: string;
  userId: number;
  data: unknown;
};

export type User = {
  id: number;
  name: string;
  avatar: string;
  accounts: Account[];
  roles: RoleType[];
  resourcePermissions: ResourcePermission[];
  token: string;
};

export const axiosInstance = axios.create();

export const setApiBaseUrl = (url: string) => {
  axiosInstance.defaults.baseURL = url;
};
export enum ApiErrorName {
  API_REQUEST_TWITTER_REQUEST_TOKEN_ERROR = 'API_REQUEST_TWITTER_REQUEST_TOKEN_ERROR',
  API_REQUEST_LOGIN_ERROR = 'API_REQUEST_LOGIN_ERROR',
  API_REQUEST_BIND_ERROR = 'API_REQUEST_BIND_ERROR',
  API_REQUEST_UNBIND_ERROR = 'API_REQUEST_UNBIND_ERROR',
}
export const ApiErrorMessageMap: { [name in ApiErrorName]: string } = {
  [ApiErrorName.API_REQUEST_TWITTER_REQUEST_TOKEN_ERROR]:
    'Twitter request token acquisition failed',
  [ApiErrorName.API_REQUEST_LOGIN_ERROR]: 'Login failed',
  [ApiErrorName.API_REQUEST_BIND_ERROR]: 'Bind failed',
  [ApiErrorName.API_REQUEST_UNBIND_ERROR]: 'Unbind failed',
};
export class ApiError extends Error {
  public constructor(name: ApiErrorName, message?: string) {
    super();
    this.name = name;
    this.message = message || ApiErrorMessageMap[name];
  }
}

// 添加响应拦截器
let authFailedCallback: any;
export const setAuthFailedCallback = (callback: () => void) => {
  authFailedCallback = callback;
};
let allowExecAuthFailedCallback = true; // 是否允许执行认证失效callback
axiosInstance.interceptors.response.use(
  (response) => {
    // 如果是登录请求，并且成功，设置下一次响应时允许执行认证失效callback
    if (
      response.config.url === '/users/login' &&
      response.status >= 200 &&
      response.status < 400
    ) {
      allowExecAuthFailedCallback = true;
    }
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (authFailedCallback) {
        // 保证多个token认证失效的响应只执行一次回调
        if (allowExecAuthFailedCallback) {
          allowExecAuthFailedCallback = false;
          authFailedCallback();
        }
        return undefined;
      } else {
        return Promise.reject(error.response?.data || error);
      }
    } else {
      // 对响应错误做点什么
      return Promise.reject(error.response?.data || error);
    }
  }
);

// TODO 这个 ApiResp 接口返回的类型考虑是否需要与后端协商统一（在这个用户系统中只有一个接口符合这个规则）
export type ApiResp<T> = {
  code: number;
  msg: string;
  data: T;
};
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
  callback?: string;
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
): AxiosPromise<LoginResult> {
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
  callback: string;
};
type BindAccountParamsForDiscordAccount = {
  type: AccountType;
  code: string;
  callback: string;
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
): AxiosPromise<BindResult> {
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
): AxiosPromise<UnBindResult> {
  const data = qs.stringify({ type });
  return axiosInstance({
    url: '/users/unlink',
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

// get user info ==================================
export type UpdateUserInfoResult = unknown;
export function updateUserInfo(
  token: string,
  data: {
    userName: string;
    userAvatar: string;
  }
): AxiosPromise<ApiResp<UpdateUserInfoResult>> {
  return axiosInstance({
    url: '/users/profile',
    method: 'post',
    data: qs.stringify(data),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export type UploadUserAvatarResult = {
  url: string;
};
export function uploadUserAvatar(
  token: string,
  file: File
): AxiosPromise<UploadUserAvatarResult> {
  const form = new FormData();
  form.append('file', file);
  return axiosInstance({
    url: '/medium/upload',
    method: 'post',
    data: form,
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
