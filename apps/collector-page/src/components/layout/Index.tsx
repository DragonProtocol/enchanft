/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-19 18:45:05
 * @Description: 站点布局入口
 */
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'
import Hammer from 'hammerjs'
import { isMobile, isDesktop } from 'react-device-detect'
import 'react-toastify/dist/ReactToastify.min.css'
import { MEDIA_BREAK_POINTS } from 'constants/index'
import Main from './Main'
import Header from './Header'
import TodoFloatingWindow from './TodoFloatingWindow'
import ScrollBox from '../common/scroll/ScrollBox'
import MainInner from './MainInner'
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchFollowedCommunities } from '../../features/user/followedCommunitiesSlice'
import { fetchUserRewards } from '../../features/user/userRewardsSlice'
import { fetchTodoTasks, selectAll } from '../../features/user/todoTasksSlice'
import { TaskTodoCompleteStatus } from '../../types/entities'
import { useGAPageView } from '../../hooks'
import Footer from './Footer'
import { selectWebsite, setMobileNavDisplay } from '../../features/website'
import useRoute from '../../hooks/useRoute'
import { navs, RouteKeys } from '../../route/routes'
import { MOBILE_BREAK_POINT } from '../../constants'
import { useWlUserReact } from '../../../../../libs/wl-user-react/core/src'
const Layout: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLogin } = useWlUserReact()
  const { mobileNavDisplay } = useAppSelector(selectWebsite)
  useGAPageView()

  const { routeKey } = useRoute()
  const [displayTodoFloating, setDisplayTodoFloating] = useState(false)
  useEffect(() => {
    if (!isLogin) {
      setDisplayTodoFloating(false)
      return
    }
    if (routeKey === RouteKeys.noMatch) {
      setDisplayTodoFloating(false)
    } else if (routeKey === RouteKeys.taskCreate) {
      setDisplayTodoFloating(false)
    } else {
      setDisplayTodoFloating(true)
    }
  }, [isLogin, routeKey])

  // 获取用户相关信息
  useEffect(() => {
    if (!isLogin) {
      return
    }
    dispatch(fetchFollowedCommunities())
    dispatch(fetchUserRewards())
    dispatch(fetchTodoTasks())
  }, [isLogin])
  const todoTasks = useAppSelector(selectAll)
  const count = todoTasks.filter(
    (item) => item.status && [TaskTodoCompleteStatus.TODO, TaskTodoCompleteStatus.IN_PRGRESS].includes(item.status),
  ).length

  useEffect(() => {
    if (isMobile) {
      // Get a reference to an element
      const hammerEl = document.querySelector('#scroll-box')
      if (hammerEl) {
        // Create a manager to manager the element
        const hammerManager = new Hammer.Manager(hammerEl, {
          touchAction: 'pan-y',
        })
        // Create a recognizer
        const Pan = new Hammer.Pan({
          threshold: 1,
          velocity: 0,
        })
        // Add the recognizer to the manager
        hammerManager.add(Pan)
        // Subscribe to a desired event
        hammerManager.on('pan', function (e) {
          if (e.direction === Hammer.DIRECTION_UP) {
            dispatch(setMobileNavDisplay(false))
          } else if (e.direction === Hammer.DIRECTION_DOWN) {
            dispatch(setMobileNavDisplay(true))
          }
        })
      }
    }
  }, [isMobile])

  const MobileNav = useCallback(
    () => (
      <MobileNavList>
        {navs.map((item, index) => (
          <>
            {index !== 0 && <MobileNavLine />}
            <MobileNavItemBox
              key={item.link}
              isActive={item.activeRouteKeys.includes(routeKey)}
              onClick={() => navigate(item.link)}
            >
              <MobileNavItemText>{item.name}</MobileNavItemText>
            </MobileNavItemBox>
          </>
        ))}
      </MobileNavList>
    ),
    [navs, routeKey],
  )
  // if (!walletChecked) return null
  return (
    <LayoutWrapper id="layout-wrapper">
      <HeaderBox>
        <HeaderInner>
          <Header />
        </HeaderInner>
      </HeaderBox>
      <MainBox>
        <ScrollBox id="scroll-box">
          <MainInner>
            <Main />
          </MainInner>
          <FooterInner>
            <Footer />
          </FooterInner>
        </ScrollBox>
      </MainBox>
      {displayTodoFloating && <TodoFloatingWindow count={count} />}
      {isMobile && mobileNavDisplay && MobileNav()}
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
  background-color: #ebeee4;
`
const HeaderBox = styled.div`
  width: 100%;
  background: #f7f9f1;
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
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    padding: 0 20px;
  }
`
const MainBox = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 72px;
  box-sizing: border-box;
`
const FooterInner = styled.div`
  width: 100%;
  height: 72px;
  box-sizing: border-box;
  padding: 0 40px;

  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    width: ${MEDIA_BREAK_POINTS.xxl}px;
    margin: 0 auto;
  }
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    padding: 0 20px;
  }
`

const MobileNavList = styled.div`
  width: 100%;
  background: #f7f9f1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  z-index: 2;
  height: 58px;
  border-top: 4px solid #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 46px;
`
const MobileNavItemBox = styled.div<{ isActive: boolean }>`
  height: 40px;
  display: flex;
  align-items: center;
  box-shadow: ${(props) => (props.isActive ? '0 4px #3DD606' : 'none')};
  transition: all 1s ease-out;
`
const MobileNavLine = styled.div`
  height: 40px;
  width: 1px;
  background: #d9d9d9;
`
const MobileNavItemText = styled.span`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  text-transform: uppercase;
  color: #333333;
  transition: all 0.5s ease-out;
`
