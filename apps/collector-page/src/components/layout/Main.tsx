/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-04 17:39:30
 * @Description: 站点主体内容（路由导航）
 */
import Profile from '../../container/Profile'
import Events from '../../container/Events'
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
import Task from '../../container/Task'
import TaskCreate from '../../container/TaskCreate'
import Projects from '../../container/Projects'
import { fetchUserWhitelists } from '../../features/user/userWhitelistsSlice'
import Project from '../../container/Project'
import Contributionranks from '../../container/Contributionranks'
import Ref from '../../container/Ref'

const Main: React.FC = () => {
  const dispatch = useAppDispatch()
  const { token, status } = useAppSelector(selectAccount)
  const isLogin = !!token
  let permissionRoutes = [
    { path: '/profile', element: <Profile /> },
    { path: '/guide', element: <Guide /> },
    { path: '/todo', element: <TodoTask /> },
    { path: '/enchanfted/:mint', element: <EnchanftedDetail /> },
    { path: '/:projectName/task/create/:projectId', element: <TaskCreate /> },
  ]
  permissionRoutes = permissionRoutes.map((route) => ({
    ...route,
    element: isLogin ? route.element : <NoLogin>You have to connect wallet to view this page!</NoLogin>,
  }))
  const routes = useRoutes([
    { path: '/', element: <Events /> },
    { path: '/creator/:taskId', element: <Creator /> },
    { path: '/projects', element: <Projects /> },
    { path: '/contributionranks/:communityId', element: <Contributionranks /> },
    { path: '/:projectSlug', element: <Project /> },
    { path: '/:projectSlug/:taskId', element: <Task /> },
    { path: '/ref/:refCode', element: <Ref /> },
    ...permissionRoutes,
    { path: '*', element: <div>404</div> },
  ])
  useEffect(() => {
    dispatch(fetchFollowedCommunities())
    dispatch(fetchUserWhitelists())
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
`
const NoLogin = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`
