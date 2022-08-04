/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-04 13:05:53
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as GiftBoxIcon } from './svgs/gift_box.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconGiftBox: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <GiftBoxIcon width={size} height={size} opacity={opacity} />
}
export default IconGiftBox
