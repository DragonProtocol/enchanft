/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-12 15:36:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-15 15:39:53
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import { TodoTaskItem, TodoTaskResponse } from '../../types/api'

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

/** 获取用户的任务列表 */
export function fetchListForUserTodoTask(): AxiosPromise<ApiResp<TodoTaskResponse>> {
  return request({
    url: `/tasks/todo`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}

/** 获取用户的单个任务 */
export type FetchOneParams = {
  id: number
}
export function fetchOneForUserTodoTask(params: FetchOneParams): AxiosPromise<ApiResp<TodoTaskItem>> {
  const { id } = params
  return request({
    url: `/tasks/${id}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}
