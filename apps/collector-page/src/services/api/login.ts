/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-07 10:15:01
 * @Description: 登录授权相关接口
 */

import qs from 'qs'
import request from '../../request/axios'

export function login(params: any) {
  const data = qs.stringify(params)
  return request({
    url: '/users/login',
    method: 'post',
    data: data,
  })
}

export function updateProfile(params: any) {
  const data = qs.stringify(params)
  return request({
    url: '/users/profile',
    method: 'post',
    data: data,
    headers: {
      needToken: true,
    },
  })
}

export const logout = () => {
  request({
    url: '/logout',
    method: 'delete',
  })
}

// 绑定社交账号
export function link(params: any) {
  const data = qs.stringify(params)
  return request({
    url: '/users/link',
    method: 'post',
    data: data,
    headers: {
      needToken: true,
    },
  })
}
