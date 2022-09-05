import axios from 'axios';
import qs from 'qs';

export function login(params: any) {
  // console.log('loginParams', params)
  const data = qs.stringify(params);
  return axios({
    url: '/users/login',
    method: 'post',
    data: data,
  });
}

export function uploadImage(file: File, token: string) {
  const form = new FormData();
  form.append('file', file);
  return axios({
    url: '/medium/upload',
    method: 'post',
    data: form,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function checkTweetIdValid(tweetId: string, token: string) {
  return axios({
    url: `/users/twitter?tweetId=${tweetId}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function checkTwitterNameValid(name: string, token: string) {
  return axios({
    url: `/users/twitter?name=${name}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
