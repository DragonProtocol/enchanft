/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 13:19:31
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as NotifyIcon } from './svgs/notify.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconNotify: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <NotifyIcon width={size} height={size} opacity={opacity} />
}

export default IconNotify
