/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-12 15:36:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-25 19:01:35
 * @Description: file description
 */
import { AxiosPromise } from 'axios'
import { loadRefInfo, RefType } from '../../container/Ref'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import { TaskDetailResponse, TodoTaskActionItem, TodoTaskItem, TodoTaskResponse } from '../../types/api'
import { State as CreateTaskState } from '../../components/business/task/create/state'
import { useGAEvent } from '../../hooks/useGoogleAnalytics'

const TASK_CATALOG_GA = 'TASK'
enum TaskActionGA {
  TAKE_TASK = 'TAKE_TASK',
  VERIFY_ACTIONS = 'VERIFY_ACTIONS',
  VERIFY_ONE_ACTION = 'VERIFY_ONE_ACTION',
}

/** 接任务 */
export type TakeTaskParams = {
  id: number
}
export function takeTask(params: TakeTaskParams): AxiosPromise<ApiResp<any>> {
  const { id } = params
  const refInfo = loadRefInfo(RefType.TAKE_TASK, String(id))
  const gaEvent = useGAEvent(TASK_CATALOG_GA)
  gaEvent(TaskActionGA.TAKE_TASK, id)
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

/** 对单个任务进行验证 */
export type VerifyOneTaskParams = {
  id: number
}
export function verifyOneTask(params: VerifyOneTaskParams): AxiosPromise<ApiResp<TodoTaskItem>> {
  const { id } = params
  const gaEvent = useGAEvent(TASK_CATALOG_GA)
  gaEvent(TaskActionGA.VERIFY_ACTIONS, id)
  return request({
    url: `/tasks/${id}/verification`,
    method: 'post',
    headers: {
      needToken: true,
    },
  })
}

/** 对单个action进行验证 */
export type VerifyOneActionParams = {
  id: number
  taskId: number
}
export function verifyOneAction(params: VerifyOneActionParams): AxiosPromise<ApiResp<TodoTaskActionItem>> {
  const { taskId, id } = params
  const gaEvent = useGAEvent(TASK_CATALOG_GA)
  gaEvent(TaskActionGA.VERIFY_ONE_ACTION, id)
  return request({
    url: `/tasks/${taskId}/actions/${id}/verification`,
    method: 'post',
    headers: {
      needToken: true,
    },
  })
}

/** 直接完成单个action */
export type CompletionOneActionParams = {
  id: number
  taskId: number
}
export function completionOneAction(params: CompletionOneActionParams): AxiosPromise<ApiResp<TodoTaskActionItem>> {
  const { taskId, id } = params
  const gaEvent = useGAEvent(TASK_CATALOG_GA)
  gaEvent(TaskActionGA.VERIFY_ONE_ACTION, id)
  return request({
    url: `/tasks/${taskId}/actions/${id}/completion`,
    method: 'post',
    headers: {
      needToken: true,
    },
  })
}

/** 获取单个任务详情 */
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
    reward: {
      type: data.reward.type,
      raffled: data.reward.raffled,
      name: data.reward.name,
      data: {
        token_num: data.reward.token_num,
      },
    },
    actions: data.actions.map((item) => {
      return {
        name: item.name,
        type: item.typeMore,
        description: item.description,
        data: {
          url: item.url,
          server_id: item.server_id,
          require_score: item.require_score,
          num: item.num,
          accounts: item.accounts,
          tweet_id: item.tweet_id,
          role: item.role,
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

export function checkTwitterNameValid(name: string) {
  return request({
    url: `/users/twitter?name=${name}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}

export function projectBindBot({ projectId, discordId }: { projectId: string; discordId: string }) {
  return request({
    url: `/projects/${projectId}/binding`,
    method: 'post',
    data: {
      discordId,
    },
    headers: {
      needToken: true,
    },
  })
}

export function checkTweetIdValid(tweetId: string) {
  return request({
    url: `/users/twitter?tweetId=${tweetId}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}
