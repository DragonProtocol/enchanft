/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-19 10:31:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-19 11:44:48
 * @Description: file description
 */
import { omitIntermediateStr } from './string'

export const getMultiavatarIdByUser = (user?: { id?: number; userId?: number; pubkey?: string }) => {
  if (user) {
    if (user.pubkey) {
      return omitIntermediateStr(user.pubkey, 8, 8, 3)
    } else if (user.userId) {
      return 'user_id_' + user.userId
    } else if (user.id) {
      return 'user_id_' + user.id
    }
  }
  return 'unknown_user'
}
