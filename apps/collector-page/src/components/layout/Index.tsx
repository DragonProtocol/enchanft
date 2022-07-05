/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 10:19:07
 * @Description: 站点布局入口
 */
import React from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from 'constants/index'
import Main from './Main'
import Header from './Header'

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
`
const MainInner = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px 48px;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: ${MEDIA_BREAK_POINTS.xxxl}px;
    margin: 0 auto;
  }
`
