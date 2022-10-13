/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:29:11
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-13 19:30:23
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'

const NoLogin: React.FC = () => {
  return <NoLoginWrapper>404</NoLoginWrapper>
}
export default NoLogin
const NoLoginWrapper = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`
