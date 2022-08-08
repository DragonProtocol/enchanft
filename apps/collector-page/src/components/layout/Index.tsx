/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-08 15:55:08
 * @Description: 站点布局入口
 */
import React from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from 'constants/index'
import Main from './Main'
import Header from './Header'
import TodoFloatingWindow from './TodoFloatingWindow'
import ScrollBox from '../common/ScrollBox'

const Layout: React.FC = () => (
  <LayoutWrapper>
    <HeaderBox>
      <HeaderInner>
        <Header />
      </HeaderInner>
    </HeaderBox>
    <MainBox>
      <ScrollBox>
        <MainInner>
          <Main />
        </MainInner>
      </ScrollBox>
      <TodoFloatingWindow />
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
  background-color: #f8f8f8;
`
const HeaderBox = styled.div`
  width: 100%;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
`
const HeaderInner = styled.div`
  width: 100%;
  height: 72px;
  box-sizing: border-box;
  padding: 0 40px;
  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    width: ${MEDIA_BREAK_POINTS.xxl}px;
    margin: 0 auto;
  }
`
const MainBox = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 72px;
  box-sizing: border-box;
`
const MainInner = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 0 40px;
  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    width: ${MEDIA_BREAK_POINTS.xxl}px;
    margin: 0 auto;
  }
`
