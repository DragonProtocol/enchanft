/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-14 18:05:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-15 11:07:18
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import request from '../../request/axios'

export function uploadImage(
  file: File,
  onUploadProgress?: (progress: { total: number; loaded: number }) => void,
): AxiosPromise<{
  url: string
}> {
  const form = new FormData()
  form.append('file', file)
  const configs = {}
  if (onUploadProgress) Object.assign(configs, { onUploadProgress })
  return request({
    url: '/medium/upload',
    method: 'post',
    data: form,
    headers: {
      needToken: true,
    },
    ...configs,
  })
}
