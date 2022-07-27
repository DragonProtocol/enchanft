/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 12:55:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-27 16:14:42
 * @Description: file description
 */
import React from 'react'
import { ReactComponent as InputSearchIcon } from './svgs/input_search.svg'
interface Props {
  size?: string
}
export const IconInputSearch: React.FC<Props> = ({ size = '1.5rem' }) => {
  return <InputSearchIcon width={size} height={size} />
}
