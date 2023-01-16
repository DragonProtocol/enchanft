/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 12:55:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 13:16:10
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as CaretLeftIcon } from './svgs/caret_left.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconCaretLeft: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <CaretLeftIcon width={size} height={size} opacity={opacity} />
}
export default IconCaretLeft
