/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-29 10:38:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-16 18:01:43
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

type CardItemBoxProps = HTMLAttributes<HTMLDivElement>
const CardItemBox: React.FC<CardItemBoxProps> = ({ children, ...otherProps }: CardItemBoxProps) => {
  return <CardItemBoxWrapper {...otherProps}>{children}</CardItemBoxWrapper>
}
export default CardItemBox
const CardItemBoxWrapper = styled.div`
  width: 100%;
  background: #f7f9f1;
  border: 2px solid #333333;
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;
`
