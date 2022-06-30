/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-24 11:20:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-28 14:12:03
 * @FilePath: \synft-app\src\service\api\launchpad.ts
 * @Description: launchpad api
 */
import axios from 'axios'
import { ProjectItem } from '../../types/api/launchpad'

export type FetchListParams = {
  page?: number
  size?: number
}
const defaultFetchListParmas = {
  page: 1,
  size: 20,
}
export const fetchListByUnderway = async (params?: FetchListParams): Promise<ProjectItem[]> => {
  const page = params?.page || defaultFetchListParmas.page
  const size = params?.size || defaultFetchListParmas.size
  const resp = await axios.get(`/data/launchpad/underway.json?page=${page}&size=${size}`)
  return resp.data
}
export const fetchListByUpcoming = async (params?: FetchListParams): Promise<ProjectItem[]> => {
  const page = params?.page || defaultFetchListParmas.page
  const size = params?.size || defaultFetchListParmas.size
  const resp = await axios.get(`/data/launchpad/upcoming.json?page=${page}&size=${size}`)
  return resp.data
}
