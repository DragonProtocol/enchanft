/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-08 19:10:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-26 18:03:10
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import { UserWhitelistsResponse } from '../../types/api'

/** 获取 我的whitelist 列表 */
export function fetchListForUserWhitelist(): AxiosPromise<ApiResp<UserWhitelistsResponse>> {
  return request({
    url: `/users/whitelists`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}
