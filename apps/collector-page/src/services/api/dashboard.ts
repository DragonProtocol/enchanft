/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-06 13:45:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-12 17:31:21
 * @Description: 公开的推荐项目和任务接口
 */
import { AxiosPromise } from 'axios'
import { ProjectFilterStatusType } from '../../components/business/dashboard/ProjectFilter'
import { API_BASE_URL } from '../../constants'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import { DashboardProjectItem, DashboardTaskItem, ProjectStatus, TaskStatus, TaskType } from '../../types/api'

export const fetchListForRecommendTasksUrl = '/tasks/recommendation'
export function fetchListForRecommendTasks(): AxiosPromise<ApiResp<DashboardTaskItem[]>> {
  return request({
    url: fetchListForRecommendTasksUrl,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}

export type fetchListForProjectParams = {
  status?: ProjectFilterStatusType
  keywords?: string
}
export const fetchListForProjectUrl = '/projects'
export function fetchListForProject(params: fetchListForProjectParams): AxiosPromise<ApiResp<DashboardProjectItem[]>> {
  return request({
    url: fetchListForProjectUrl,
    method: 'get',
    params,
  })
}
