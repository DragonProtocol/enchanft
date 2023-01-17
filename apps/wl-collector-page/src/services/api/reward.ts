/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-08 19:10:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-07 11:32:57
 * @Description: file description
 */
import { AxiosPromise } from 'axios';
import request from '../../request/axios';
import { ApiResp } from '../../types';
import { UserRewardsResponse } from '../../types/api';

export function fetchListForUserReward(): AxiosPromise<
  ApiResp<UserRewardsResponse>
> {
  return request({
    url: `/users/rewards`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}
