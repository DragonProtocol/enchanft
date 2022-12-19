/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 10:08:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 11:19:39
 * @Description: 后端api请求封装
 */
import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosPromise,
} from 'axios';
import qs from 'qs';
import {
  AuthorizerType,
  WlUserActionType,
  WlUserReactContextType,
} from '@ecnft/wl-user-react';
import { API_BASE_URL } from '../../constants';

export type RequestPromise<T> = AxiosPromise<T>;
export type AxiosCustomHeaderType = {
  // 当前接口是否需要传递token
  needToken?: boolean;
  // 当前接口设置的token
  token?: string;
};

export type AxiosCustomConfigType = AxiosRequestConfig & {
  headers?: AxiosRequestHeaders & AxiosCustomHeaderType;
};

let store;
export const injectStore = (storeInstance: any) => {
  store = storeInstance;
};

// 从外部注入wlUserReactProvider提供的功能数据 （为了在此文件中访问token等信息）
let wlUserReactContextValue: WlUserReactContextType | undefined;
export const injectWlUserReactContextValue = (value: any) => {
  wlUserReactContextValue = value;
};
let handleAxiosResponse401: () => void | undefined;
export const injectHandleAxiosResponse401 = (func: () => void) => {
  handleAxiosResponse401 = func;
};
// axios 实例
const axiosInstance = axios.create();
// 请求超时的毫秒数(0 表示无超时时间)
// axiosInstance.defaults.timeout = 30000

axiosInstance.defaults.baseURL = API_BASE_URL;

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config: AxiosCustomConfigType) => {
    // 1、凭证
    const { needToken } = config.headers || {};
    // TODO 这里先默认加Authorization，后续优化
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer `;
    if (needToken && wlUserReactContextValue) {
      const { isLogin, user } = wlUserReactContextValue;

      const token = config.headers?.token || (isLogin ? user.token : ''); // token从store中获取
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 2、get请求，params参数序列化
    if (config.method === 'get') {
      config.paramsSerializer = (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' });
    }
    return config;
  },
  (error) =>
    // 对请求错误做些什么
    Promise.reject(error)
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      wlUserReactContextValue.dispatchAction({
        type: WlUserActionType.LOGIN,
        payload: AuthorizerType.EVM_WALLET_KIT,
      });
      return undefined;
    }
    // 对响应错误做点什么
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
