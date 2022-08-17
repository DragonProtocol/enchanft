/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-08 10:00:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-17 14:32:00
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

type MainContentBoxProps = HTMLAttributes<HTMLDivElement>
const MainContentBox: React.FC<MainContentBoxProps> = ({ children, ...divProps }) => {
  return <MainContentBoxWrapper {...divProps}>{children}</MainContentBoxWrapper>
}
export default MainContentBox
const MainContentBoxWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin: 20px 0;
`
