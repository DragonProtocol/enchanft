/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 18:19:38
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as TwitterWhiteIcon } from './svgs/twitter_white.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconTwitterWhite: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <TwitterWhiteIcon width={size} height={size} opacity={opacity} />
}
export default IconTwitterWhite
