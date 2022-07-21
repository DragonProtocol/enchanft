/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 16:32:55
 * @Description: 站点主体内容（路由导航）
 */
import Profile from '../../container/Profile'
import Events from '../../container/Events'
import Community from '../../container/Community'
import CallBack from '../../container/CallBack'
import React, { useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import styled from 'styled-components'
import TodoTask from '../../container/TodoTask'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectAccount } from '../../features/user/accountSlice'
import { fetchFollowedCommunities } from '../../features/user/followedCommunitiesSlice'
import EnchanftedDetail from '../../container/EnchanftedDetail'
import TaskDetail from '../../container/TaskDetail'
import Projects from '../../container/Projects'

const Main: React.FC = () => {
  const dispatch = useAppDispatch()
  const { token } = useAppSelector(selectAccount)
  const isLogin = true
  const permissionRoutes = isLogin
    ? [
        { path: '/profile', element: <Profile /> },
        { path: '/todo', element: <TodoTask /> },
        { path: '/enchanfted/:mint', element: <EnchanftedDetail /> },
      ]
    : []
  const routes = useRoutes([
    { path: '/', element: <Events /> },
    { path: '/task/:id', element: <TaskDetail /> },
    { path: '/project', element: <Projects /> },
    { path: '/community/:communityId', element: <Community /> },
    { path: '/calendar', element: <div>Calendar Page</div> },
    { path: '/callback', element: <CallBack /> },
    ...permissionRoutes,
    { path: '*', element: <div>404</div> },
  ])
  useEffect(() => {
    dispatch(fetchFollowedCommunities())
  }, [token])
  return <MainWrapper>{routes}</MainWrapper>
}
export default Main
const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`
