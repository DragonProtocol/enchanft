/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 13:29:46
 * @Description: 常用类型定义
 */
export enum AsyncRequestStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

export type ApiResp<T> = {
  code: number;
  msg: string;
  data: T;
};

export type ApiPageResp<T> = {
  code: number;
  msg: string;
  currentPage: number;
  data: T;
};
