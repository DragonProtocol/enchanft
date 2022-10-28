/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 12:55:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 13:17:17
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as CaretRightIcon } from './svgs/caret_right.svg'
interface Props {
  size?: string
  opacity?: number
}
const IconCaretRight: React.FC<Props> = ({ size = '1.5rem', opacity = 1 }) => {
  return <CaretRightIcon width={size} height={size} opacity={opacity} />
}
export default IconCaretRight
