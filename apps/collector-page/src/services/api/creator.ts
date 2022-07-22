import qs from 'qs'
import request from '../../request/axios'

export function creatorApi(params: any) {
  const data = qs.stringify(params)
  return request({
    url: '/creator',
    method: 'post',
    data: data,
  })
}
