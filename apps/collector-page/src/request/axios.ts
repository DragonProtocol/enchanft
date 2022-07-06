/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 10:08:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-06 18:29:55
 * @Description: axios 封装：凭证，参数序列化
 */
import { RootState, store } from '../store/store'
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import qs from 'qs'
export type AxiosCustomHeaderType = {
  // 当前接口是否需要传递token
  needToken?: boolean
  // 当前接口设置的token
  token?: string
}

export type AxiosCustomConfigType = AxiosRequestConfig & { headers?: AxiosRequestHeaders & AxiosCustomHeaderType }

// 请求超时的毫秒数(0 表示无超时时间)
axios.defaults.timeout = 30000

// 定义一个自定义HTTP状态码的错误范围，返回 `true`，promise 将被 resolve; 否则，promise 将被 rejecte
axios.defaults.validateStatus = (status) => status >= 200 && status <= 500 // 默认的

// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true

// 添加请求拦截器
axios.interceptors.request.use(
  (config: AxiosCustomConfigType) => {
    // 1、凭证
    const { needToken, token } = config.headers || {}
    if (needToken && token) {
      const { token } = (store.getState() as RootState).account // token从store中获取
      if (!config.headers) config.headers = {}
      config.headers.Authorization = token
    }
    // 2、get请求，params参数序列化
    if (config.method === 'get') {
      config.paramsSerializer = (params) => qs.stringify(params, { arrayFormat: 'repeat' })
    }
    return config
  },
  (error) =>
    // 对请求错误做些什么
    Promise.reject(error),
)

// 添加响应拦截器
axios.interceptors.response.use(
  (response) =>
    // 对响应数据做点什么
    response,
  (error) =>
    // 对响应错误做点什么
    Promise.reject(error),
)

export default axios
