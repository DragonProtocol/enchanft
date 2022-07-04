/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 10:28:10
 * @Description: 相关请求拦截
 */

export default [
  {
    url: /^\/auth\/token\/logout(\\?.*|)$/,
    method: 'delete',
    resp: {
      access_token: 'f134a5f7-c5cb-438f-859a-623f6d96dd1a',
      token_type: 'bearer',
      refresh_token: '8c068ba2-eb9f-4513-9ac3-37c87dec55e7',
      user_info: {
        password: null,
        username: 'admin',
        id: 1,
        phone: '13800138000',
      },
    },
  },
  {
    url: /^\/auth\/oauth\/token(\\?.*|)$/,
    method: 'post',
    resp: {
      code: 0,
      msg: null,
      data: null,
    },
  },
]
