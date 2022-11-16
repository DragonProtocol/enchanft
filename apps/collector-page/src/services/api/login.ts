/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-16 11:19:29
 * @Description: 登录授权相关接口
 */

import { AxiosPromise } from 'axios'
import qs from 'qs'
import request from '../../request/axios'
import { ApiResp } from '../../types'

export function login(params: any) {
  // console.log('loginParams', params)
  const data = qs.stringify(params)
  return request({
    url: '/users/login',
    method: 'post',
    data: data,
  })
}

export function getProfile() {
  return request({
    url: '/users/profile',
    method: 'get',
    headers: {
      needToken: true,
    },
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

export function uploadAvatar(file: File) {
  const form = new FormData()
  form.append('file', file)
  return request({
    url: '/medium/upload',
    method: 'post',
    data: form,
    headers: {
      needToken: true,
    },
  })
}

export function uploadImage(file: File) {
  const form = new FormData()
  form.append('file', file)
  return request({
    url: '/medium/upload',
    method: 'post',
    data: form,
    headers: {
      needToken: true,
    },
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
      token: params.token,
      needToken: true,
    },
  })
}

// 解绑社交账号
export function unlink(params: any) {
  const data = qs.stringify(params)
  return request({
    url: '/users/unlink',
    method: 'post',
    data: data,
    headers: {
      token: params.token,
      needToken: true,
    },
  })
}
