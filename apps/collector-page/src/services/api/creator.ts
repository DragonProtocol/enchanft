import axios from 'axios'
import qs from 'qs'
const fileDownload = require('js-file-download')

import request from '../../request/axios'

export function creatorApi(params: any) {
  return request({
    url: `/creator/dashboard/${params.task}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  })
}

export function saveWinnersApi(params: any) {
  const data = qs.stringify(params)
  return request({
    url: '/creator/save/',
    method: 'post',
    data: data,
    headers: {
      needToken: true,
    },
  })
}

export function downloadWinner(taskId: string) {
  request({
    url: `/creator/download/${taskId}.csv`,
    method: 'get',
    responseType: 'blob',
    headers: {
      needToken: true,
    },
  }).then((response) => {
    fileDownload(response.data, 'winner.csv')
  })
}
