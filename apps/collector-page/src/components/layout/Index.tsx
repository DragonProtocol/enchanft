/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-12 14:20:04
 * @Description: 站点布局入口
 */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { MEDIA_BREAK_POINTS } from 'constants/index'
import Main, { CutomRouteObject, permissionRoutes, RouteKeys, routes } from './Main'
import Header from './Header'
import TodoFloatingWindow from './TodoFloatingWindow'
import ScrollBox from '../common/ScrollBox'
import MainInner from './MainInner'
import { matchRoutes, useLocation } from 'react-router-dom'
import { useGAPageView } from '../../hooks'

const Layout: React.FC = () => {
  useGAPageView()
  // TODO 后面对路由优化时，这个matchRoutes重复代码可封装成hooks
  const location = useLocation()
  const [displayTodoFloating, setDisplayTodoFloating] = useState(true)
  useEffect(() => {
    const match = matchRoutes([...permissionRoutes, ...routes], location)
    if (!match) {
      setDisplayTodoFloating(false)
    } else {
      const { key } = match[0].route as CutomRouteObject
      if (key === RouteKeys.taskCreate) {
        setDisplayTodoFloating(false)
      } else {
        setDisplayTodoFloating(true)
      }
    }
  }, [location])
  return (
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
        {displayTodoFloating && <TodoFloatingWindow />}
      </MainBox>
      <ToastContainer autoClose={2000} position="top-right" />
    </LayoutWrapper>
  )
}
export default Layout
const LayoutWrapper = styled.div`
  width: 100vw;
  height: 100vh;
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
