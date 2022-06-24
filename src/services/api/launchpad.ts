/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-24 11:20:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-24 11:42:03
 * @FilePath: \synft-app\src\service\api\launchpad.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
