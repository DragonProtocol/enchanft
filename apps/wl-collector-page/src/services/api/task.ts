/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-12 15:36:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 17:43:05
 * @Description: file description
 */
import { AxiosPromise } from 'axios';
import { loadRefInfo, RefType } from '../../container/Ref';
import request from '../../request/axios';
import { ApiResp } from '../../types';
import {
  TaskDetailResponse,
  TodoTaskActionItem,
  TodoTaskItem,
  TodoTaskResponse,
} from '../../types/api';
import { useGAEvent } from '../../hooks/useGoogleAnalytics';
import { TASK_PARTICIPANTS_FETCH_NUM } from '../../constants';

const TASK_CATALOG_GA = 'TASK';
enum TaskActionGA {
  TAKE_TASK = 'TAKE_TASK',
  VERIFY_ACTIONS = 'VERIFY_ACTIONS',
  VERIFY_ONE_ACTION = 'VERIFY_ONE_ACTION',
}

/** 接任务 */
export type TakeTaskParams = {
  id: number;
};
export function takeTask(params: TakeTaskParams): AxiosPromise<ApiResp<any>> {
  const { id } = params;
  const refInfo = loadRefInfo(RefType.TAKE_TASK, String(id));
  const gaEvent = useGAEvent(TASK_CATALOG_GA);
  gaEvent(TaskActionGA.TAKE_TASK, id);
  if (refInfo && refInfo.referrerId > 0) {
    return request({
      url: `/tasks/${id}/takers`,
      method: 'post',
      data: {
        referrerId: refInfo.referrerId,
      },
      headers: {
        needToken: true,
      },
    });
  }
  return request({
    url: `/tasks/${id}/takers`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}

/** 获取用户的任务列表 */
export function fetchListForUserTodoTask(): AxiosPromise<
  ApiResp<TodoTaskResponse>
> {
  return request({
    url: `/tasks/todo`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}

/** 对单个任务进行验证 */
export type VerifyOneTaskParams = {
  id: number;
};
export function verifyOneTask(
  params: VerifyOneTaskParams
): AxiosPromise<ApiResp<TodoTaskItem>> {
  const { id } = params;
  const gaEvent = useGAEvent(TASK_CATALOG_GA);
  gaEvent(TaskActionGA.VERIFY_ACTIONS, id);
  return request({
    url: `/tasks/${id}/verification`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}

/** 对单个action进行验证 */
export type VerifyOneActionParams = {
  id: number;
  taskId: number;
};
export function verifyOneAction(
  params: VerifyOneActionParams
): AxiosPromise<ApiResp<TodoTaskActionItem>> {
  const { taskId, id } = params;
  const gaEvent = useGAEvent(TASK_CATALOG_GA);
  gaEvent(TaskActionGA.VERIFY_ONE_ACTION, id);
  return request({
    url: `/tasks/${taskId}/actions/${id}/verification`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}

/** 直接完成单个action */
export type CompletionOneActionParams = {
  id: number;
  taskId: number;
};
export function completionOneAction(
  params: CompletionOneActionParams
): AxiosPromise<ApiResp<TodoTaskActionItem>> {
  const { taskId, id } = params;
  const gaEvent = useGAEvent(TASK_CATALOG_GA);
  gaEvent(TaskActionGA.VERIFY_ONE_ACTION, id);
  return request({
    url: `/tasks/${taskId}/actions/${id}/completion`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}

/** 问卷调查提交 */
export type ConfirmQuestionActionParams = {
  id: number;
  taskId: number;
  answer: string;
};
export enum ResponseBizErrCode {
  ACTION_ANSWER_CORRECT = 1001,
  ACTION_ANSWER_WRONG = 1002,
}
export type ConfirmQuestionActionApiResp = {
  code: ResponseBizErrCode;
};
export function confirmQuestionAction(
  params: ConfirmQuestionActionParams
): AxiosPromise<ConfirmQuestionActionApiResp> {
  const { taskId, id, answer } = params;
  const gaEvent = useGAEvent(TASK_CATALOG_GA);
  gaEvent(TaskActionGA.VERIFY_ONE_ACTION, id);
  return request({
    url: `/tasks/${taskId}/actions/${id}/doing`,
    method: 'post',
    headers: {
      needToken: true,
    },
    data: {
      answer,
    },
  });
}

/** 获取单个任务详情 */
export function fetchDetail(
  id: number
): AxiosPromise<ApiResp<TaskDetailResponse>> {
  return request({
    url: `/tasks/${id}?participants=${TASK_PARTICIPANTS_FETCH_NUM}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}

export function checkTwitterNameValid(name: string) {
  return request({
    url: `/users/twitter?name=${name}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}

export function projectBindBot({
  projectId,
  discordId,
}: {
  projectId: string;
  discordId: string;
}) {
  return request({
    url: `/projects/${projectId}/binding`,
    method: 'post',
    data: {
      discordId,
    },
    headers: {
      needToken: true,
    },
  });
}

export function checkTweetIdValid(tweetId: string) {
  return request({
    url: `/users/twitter?tweetId=${tweetId}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}
