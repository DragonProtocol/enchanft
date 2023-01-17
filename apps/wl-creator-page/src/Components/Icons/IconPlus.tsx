/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 12:35:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-16 14:25:10
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as PlusIcon } from './svgs/plus.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconPlus: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <PlusIcon width={size} height={size} opacity={opacity} />
}

export default IconPlus
