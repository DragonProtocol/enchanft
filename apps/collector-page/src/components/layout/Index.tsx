/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-06 13:55:20
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
import ScrollBox from '../common/scroll/ScrollBox'
import MainInner from './MainInner'
import { matchRoutes, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectAccount, setIsLogin, userLink } from '../../features/user/accountSlice'
import { fetchFollowedCommunities } from '../../features/user/followedCommunitiesSlice'
import { fetchUserWhitelists } from '../../features/user/userWhitelistsSlice'
import { fetchTodoTasks, selectAll } from '../../features/user/todoTasksSlice'
import { TaskTodoCompleteStatus } from '../../types/entities'
import { useGAPageView } from '../../hooks'
import Footer from './Footer'
import useWalletSign from '../../hooks/useWalletSign'
const Layout: React.FC = () => {
  const dispatch = useAppDispatch()
  const { token, pubkey, isLogin } = useAppSelector(selectAccount)
  useEffect(() => {
    dispatch(setIsLogin(!!token && !!pubkey))
  }, [token, pubkey])

  useGAPageView()
  useWalletSign()
  // TODO 后面对路由优化时，这个matchRoutes重复代码可封装成hooks
  const location = useLocation()
  const [displayTodoFloating, setDisplayTodoFloating] = useState(false)
  useEffect(() => {
    if (!isLogin) {
      setDisplayTodoFloating(false)
      return
    }
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
  }, [location, isLogin])

  // 获取用户相关信息
  useEffect(() => {
    if (!isLogin) {
      return
    }
    dispatch(fetchFollowedCommunities())
    dispatch(fetchUserWhitelists())
    dispatch(fetchTodoTasks())
  }, [isLogin])
  const todoTasks = useAppSelector(selectAll)
  const count = todoTasks.filter((item) =>
    [TaskTodoCompleteStatus.TODO, TaskTodoCompleteStatus.IN_PRGRESS].includes(item.status),
  ).length
  //社媒账号授权 code 监听
  useEffect(() => {
    localStorage.setItem('social_auth', JSON.stringify({ code: null, type: null }))
    const handleStorageChange = ({ newValue, key, url }) => {
      if ('social_auth' === key) {
        console.log('social_auth change url', url)
        // if ("social_auth" === key && url.includes("https://launch.enchanft.xyz/#/callback")) {
        const { code, type } = JSON.parse(newValue || '')
        if (code && type) {
          linkUser({ code, type })
          localStorage.setItem('social_auth', JSON.stringify({ code: null, type: null }))
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const linkUser = (accountInfo) => {
    const code = accountInfo.code
    const type = accountInfo.type || 'TWITTER'
    if (code && type) {
      dispatch(userLink({ code, type }))
    } else {
      alert('account bind failed!')
    }
  }

  // if (!walletChecked) return null
  return (
    <LayoutWrapper>
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
`
