/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-08 10:00:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-10 16:08:44
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'

type MainContentBoxProps = {
  children: any
}
const MainContentBox: React.FC<MainContentBoxProps> = ({ children }) => {
  return <MainContentBoxWrapper>{children}</MainContentBoxWrapper>
}
export default MainContentBox
const MainContentBoxWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin: 20px 0;
`
