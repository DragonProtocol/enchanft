/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-06 13:45:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-08 16:48:49
 * @Description: 公开的推荐项目和任务接口
 */
import { AxiosPromise } from 'axios'
import { ProjectFilterStatusType } from '../../components/business/dashboard/ProjectFilter'
import { API_BASE_URL } from '../../constants'
import request from '../../request/axios'
import { ApiResp } from '../../types'
import { ProjectStatus, TaskStatus, TaskType } from '../../types/api'

export type TaskItemForDashboardRecommend = {
  id: number
  name: string
  type: TaskType
  startTime: number
  endTime: number
  winnersNum: number
  acceptedStatus: TaskStatus
  project: {
    id: number
    name: string
    image: string
    status: ProjectStatus
  }
  actions: Array<{
    id: number
    name: string
  }>
}
export const fetchListForRecommendTasksUrl = '/task/listForRecommendTasks'
export function fetchListForRecommendTasks(): AxiosPromise<ApiResp<TaskItemForDashboardRecommend[]>> {
  return request({
    url: fetchListForRecommendTasksUrl,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}

export type ProjectItemForDashboard = {
  id: number
  name: string
  image: string
  status: ProjectStatus
  taskNum: number
  floorPrice: string
  injectedCoins: string
  itemsNum: number
  mintPrice: string
  mintStartTime: number
  community: {
    id: number
    name: string
    image: string
  }
  tasks: Array<{
    type: TaskType
    startTime: number
    endTime: number
  }>
}

export type fetchListForProjectParams = {
  status?: ProjectFilterStatusType
  keyword?: string
}
export const fetchListForProjectUrl = '/project/listForProject'
export function fetchListForProject(
  params: fetchListForProjectParams,
): AxiosPromise<ApiResp<ProjectItemForDashboard[]>> {
  return request({
    url: fetchListForProjectUrl,
    method: 'get',
    params,
  })
}
