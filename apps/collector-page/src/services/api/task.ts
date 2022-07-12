/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-12 15:36:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-12 18:06:35
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import request from '../../request/axios'
import { ApiResp } from '../../types'

/** 接任务 */
export type TakeTaskParams = {
  id: number
}
export function takeTask(params: TakeTaskParams): AxiosPromise<ApiResp<any>> {
  const { id } = params

  return request({
    url: `/tasks/${id}/takers`,
    method: 'post',
    headers: {
      needToken: true,
    },
  })
}
