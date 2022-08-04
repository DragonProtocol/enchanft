/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-03 16:43:53
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as TrophyIcon } from './svgs/trophy.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconTrophy: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <TrophyIcon width={size} height={size} opacity={opacity} />
}
export default IconTrophy
