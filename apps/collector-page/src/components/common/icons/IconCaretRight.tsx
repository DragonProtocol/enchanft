/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 12:55:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-27 15:50:19
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as CaretRightIcon } from './svgs/caret_right.svg'
interface Props {
  size?: string
}
export const IconCaretRight: React.FC<Props> = ({ size = '1.5rem' }) => {
  return <CaretRightIcon width={size} height={size} />
}
