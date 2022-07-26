import axios from 'axios'
import qs from 'qs'
const fileDownload = require('js-file-download')

import request from '../../request/axios'

export function creatorApi(params: any) {
  const data = qs.stringify(params)
  return request({
    url: '/creator/dashboard',
    method: 'post',
    data: data,
  })
}

export function saveWinnersApi(params: any) {
  const data = qs.stringify(params)
  return request({
    url: '/creator/save/',
    method: 'post',
    data: data,
  })
}

export function downloadWinner(taskId: string) {
  axios
    .get(`/creator/download/${taskId}.csv`, {
      responseType: 'blob',
    })
    .then((response) => {
      fileDownload(response.data, 'winner.csv')
    })
}
