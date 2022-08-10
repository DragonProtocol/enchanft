/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-10 13:01:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-10 13:04:58
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import MainInner from './MainInner'
const MainInnerStatusBox: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...divProps }) => {
  return <MainInnerStatusBoxWrapper {...divProps}>{children}</MainInnerStatusBoxWrapper>
}
export default MainInnerStatusBox
const MainInnerStatusBoxWrapper = styled(MainInner)`
  display: flex;
  justify-content: center;
  align-items: center;
`
