/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-01 11:27:17
 * @Description: 常用类型定义
 */
export enum AsyncRequestStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}
export enum ApiRespCode {
  SUCCESS = 0,
  ERROR = 1,
}
export type ApiResp<T> = {
  code: ApiRespCode;
  msg: string;
  data: T;
};

// TODO 预留的针对与分页的api响应格式，暂时还没确定，可能不需要
export type ApiPageResp<T> = {
  code: ApiRespCode;
  msg: string;
  currentPage: number;
  data: T;
};
