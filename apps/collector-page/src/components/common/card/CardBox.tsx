/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-29 10:38:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-29 10:47:57
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'

type CardBoxProps = {
  children: any
}
const CardBox: React.FC<CardBoxProps> = ({ children, ...otherProps }: CardBoxProps) => {
  return <CardBoxWrapper {...otherProps}>{children}</CardBoxWrapper>
}
export default CardBox
const CardBoxWrapper = styled.div`
  width: 100%;
  padding: 40px;
  background: #ffffff;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
`
