/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-06 11:01:47
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-06 11:14:22
 * @Description: file description
 */
import { selectAccount } from '../features/user/accountSlice'
import { useAppSelector } from '../store/hooks'
export default () => {
  const { token, pubkey } = useAppSelector(selectAccount)
  const isLogin = !!pubkey && !!token
  return { isLogin }
}
