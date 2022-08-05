/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-12 15:36:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 18:58:15
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import { loadRefInfo, RefType } from '../../container/Ref'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import { TaskDetailResponse, TodoTaskItem, TodoTaskResponse } from '../../types/api'
import { State as CreateTaskState } from '../../components/business/task/create/state'

/** 接任务 */
export type TakeTaskParams = {
  id: number
}
export function takeTask(params: TakeTaskParams): AxiosPromise<ApiResp<any>> {
  const { id } = params
  const refInfo = loadRefInfo(RefType.TAKE_TASK, String(id))
  if (refInfo && refInfo.referrerId > 0) {
    return request({
      url: `/tasks/${id}/takers`,
      method: 'post',
      data: {
        referrerId: refInfo!.referrerId,
      },
      headers: {
        needToken: true,
      },
    })
  } else {
    return request({
      url: `/tasks/${id}/takers`,
      method: 'post',
      headers: {
        needToken: true,
      },
    })
  }
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

export function createTask(data: CreateTaskState) {
  const postData = {
    projectId: data.projectId,
    name: data.name,
    description: data.description,
    image: data.image,
    winNum: data.winnerNum,
    startTime: data.startTime,
    endTime: data.endTime,
    reward: data.reward,
    actions: data.actions.map((item) => {
      return {
        name: item.name,
        type: item.typeMore,
        description: '',
        data: {
          url: item.url,
          server_id: item.server_id,
          require_score: item.require_score,
          num: item.num,
        },
      }
    }),
  }
  return request({
    url: `/tasks`,
    method: 'post',
    data: postData,
    headers: {
      needToken: true,
    },
  })
}
