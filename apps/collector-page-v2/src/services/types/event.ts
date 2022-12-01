/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-30 10:25:12
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 13:15:05
 * @Description: file description
 */
import { ApiPageResp, ApiResp } from '.';

export type EventEntity = {
  id: number;
};
export type EventExploreListResponse = ApiPageResp<Array<EventEntity>>;
export type EventFavoriteListResponse = ApiResp<Array<EventEntity>>;
