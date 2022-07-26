/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-19 12:54:43
 * @Description: 站点主体内容（路由导航）
 */
import Profile from '../../container/Profile'
import Dashboard from '../../container/Dashboard'
import Community from '../../container/Community'
import React, { useEffect } from 'react'
import Creator from '../../container/Creator'
import { useRoutes } from 'react-router-dom'
import styled from 'styled-components'
import TodoTask from '../../container/TodoTask'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectAccount, userLink } from '../../features/user/accountSlice'

import { fetchFollowedCommunities } from '../../features/user/followedCommunitiesSlice'
import Guide from '../../container/Guide'
import EnchanftedDetail from '../../container/EnchanftedDetail'

const Main: React.FC = () => {
  const dispatch = useAppDispatch()
  const { token } = useAppSelector(selectAccount)
  const isLogin = !!token
  const permissionRoutes = isLogin
    ? [
        { path: '/profile', element: <Profile /> },
        { path: '/guide', element: <Guide /> },
        { path: '/todo', element: <TodoTask /> },
        { path: '/enchanfted/:mint', element: <EnchanftedDetail /> },
      ]
    : []
  const routes = useRoutes([
    { path: '/', element: <Dashboard /> },
    { path: '/community/:communityId', element: <Community /> },
    { path: '/calendar', element: <div>Calendar Page</div> },
    { path: '/creator/:taskId', element: <Creator /> },
    ...permissionRoutes,
    { path: '*', element: <div>404</div> },
  ])
  useEffect(() => {
    dispatch(fetchFollowedCommunities())
  }, [token])

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

  return <MainWrapper>{routes}</MainWrapper>
}
export default Main
const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`
