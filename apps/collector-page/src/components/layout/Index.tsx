/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-14 15:32:55
 * @Description: 站点布局入口
 */
import React from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from 'constants/index'
import Main from './Main'
import Header from './Header'
import TodoFloatingWindow from './TodoFloatingWindow'

const Layout: React.FC = () => (
  <LayoutWrapper>
    <HeaderBox>
      <HeaderInner>
        <Header />
      </HeaderInner>
    </HeaderBox>
    <MainBox>
      <MainInner>
        <Main />
        <TodoFloatingWindow />
      </MainInner>
    </MainBox>
  </LayoutWrapper>
)
export default Layout
const LayoutWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const HeaderBox = styled.div`
  width: 100%;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
`
const HeaderInner = styled.div`
  width: 100%;
  height: 72px;
  box-sizing: border-box;
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: ${MEDIA_BREAK_POINTS.xxxl}px;
    margin: 0 auto;
  }
`
const MainBox = styled.div`
  flex: 1;
  width: 100%;
  overflow: hidden;
  z-index: 1;
`
const MainInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: ${MEDIA_BREAK_POINTS.xxxl}px;
    margin: 0 auto;
  }
`
