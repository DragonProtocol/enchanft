/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-12 15:36:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 18:58:15
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import { loadRefInfo, REF_TYPE } from '../../container/Ref'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import { TaskDetailResponse, TodoTaskItem, TodoTaskResponse } from '../../types/api'

/** 接任务 */
export type TakeTaskParams = {
  id: number
}
export function takeTask(params: TakeTaskParams): AxiosPromise<ApiResp<any>> {
  const { id } = params
  const refInfo = loadRefInfo(REF_TYPE.TAKE_TASK,String(id))
  return request({
    url: `/tasks/${id}/takers`+ refInfo ? '?referrerId='+refInfo!.referrerId:'',
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

export function fetchDetail(id: number): AxiosPromise<ApiResp<TaskDetailResponse>> {
  return request({
    url: `/tasks/${id}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}
