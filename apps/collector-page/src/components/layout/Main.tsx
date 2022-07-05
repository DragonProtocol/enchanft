/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 10:19:28
 * @Description: 站点主体内容（路由导航）
 */
import Profile from 'container/Profile'
import React from 'react'
import { useRoutes } from 'react-router-dom'
import styled from 'styled-components'

const Main: React.FC = () => {
  const isLogin = true
  const permissionRoutes = isLogin
    ? [
        { path: '/profile', element: <Profile /> },
        { path: '/settings', element: <div>Settings Page</div> },
      ]
    : []
  const routes = useRoutes([
    { path: '/', element: <div>Home Page</div> },
    { path: '/calendar', element: <div>Calendar Page</div> },
    ...permissionRoutes,
    { path: '*', element: <div>404</div> },
  ])
  return <MainWrapper>{routes}</MainWrapper>
}
export default Main
const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`
