/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-24 00:07:09
 * @Description: 站点主体内容（路由导航）
 */

import React, { useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import styled from 'styled-components'
import { permissionRoutes, routes } from '../../route/routes'
import { useWlUserReact } from '@ecnft/wl-user-react'
const Main: React.FC = () => {
  const { isLogin } = useWlUserReact()
  const permissionRoutesMap = permissionRoutes.map((route) => ({
    ...route,
    element: isLogin ? route.element : <NoLogin>Need Login</NoLogin>,
  }))
  const renderRoutes = useRoutes([...routes, ...permissionRoutesMap])
  return <MainWrapper>{renderRoutes}</MainWrapper>
}
export default Main
const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
`
const NoLogin = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`
