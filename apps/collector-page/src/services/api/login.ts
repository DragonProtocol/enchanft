/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 10:22:28
 * @Description: 登录相关接口
 */

import qs from 'qs'
import request from 'request/axios'

export function login(params: any) {
  const dataObj = qs.stringify(params)
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    headers: {
      isToken: false,
      'TENANT-ID': 1,
      Authorization: 'Basic cGlnOnBpZw==',
    },
    data: dataObj,
  })
}
export const logout = () =>
  request({
    url: '/auth/token/logout',
    method: 'delete',
  })
