/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-11 12:58:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-25 17:22:05
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'

type OverflowEllipsisBoxProps = {
  children: any
  // 行数（超出多少行显示省略号）
  number?: number
}
const OverflowEllipsisBox: React.FC<OverflowEllipsisBoxProps> = ({
  children,
  number = 1,
  ...otherProps
}: OverflowEllipsisBoxProps) => {
  return (
    <OverflowEllipsisBoxWrapper number={number} {...otherProps}>
      {children}
    </OverflowEllipsisBoxWrapper>
  )
}
export default OverflowEllipsisBox
const OverflowEllipsisBoxWrapper = styled.div<{ number: number }>`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => props.number};
  -webkit-box-orient: vertical;
`
