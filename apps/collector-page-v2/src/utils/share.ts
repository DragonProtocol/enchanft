/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-15 17:21:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-15 17:23:29
 * @Description: file description
 */
import { US_HOST_URI } from '../constants';

export const getEventShareUrl = (id: string | number) => {
  return `${US_HOST_URI}/events/${id}`;
};
export const getProjectShareUrl = (id: string | number) => {
  return `${US_HOST_URI}/projects/${id}`;
};
