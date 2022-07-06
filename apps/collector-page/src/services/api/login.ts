/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-06 16:31:26
 * @Description: 登录授权相关接口
 */

import qs from 'qs'
import request from '../../request/axios'

export function login(params: any) {
  const data = qs.stringify(params)
  return request({
    url: '/login',
    method: 'post',
    data: data,
  })
}
export const logout = () => {
  request({
    url: '/logout',
    method: 'delete',
  })
}
