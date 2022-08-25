/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-25 15:10:01
 * @Description: 站点主体内容（路由导航）
 */
import Profile from '../../container/Profile'
import Events from '../../container/Events'
import React, { useEffect } from 'react'
import Creator from '../../container/Creator'
import { RouteObject, useRoutes } from 'react-router-dom'
import styled from 'styled-components'
import TodoTask from '../../container/TodoTask'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectAccount, userLink } from '../../features/user/accountSlice'

import Guide from '../../container/Guide'
import Task from '../../container/Task'
import TaskCreate from '../../container/TaskCreate'
import Projects from '../../container/Projects'
import Project from '../../container/Project'
import Contributionranks from '../../container/Contributionranks'
import Ref from '../../container/Ref'

export enum RouteKeys {
  profile = 'profile',
  events = 'events',
  creator = 'creator',
  todoTask = 'todoTask',
  guide = 'guide',
  enchanftedDetail = 'enchanftedDetail',
  task = 'task',
  taskCreate = 'taskCreate',
  projects = 'projects',
  project = 'project',
  contributionranks = 'contributionranks',
  ref = 'ref',
  noMatch = 'noMatch',
}
export type CutomRouteObject = RouteObject & {
  key: RouteKeys
}
export const permissionRoutes: CutomRouteObject[] = [
  { path: '/profile', element: <Profile />, key: RouteKeys.profile },
  { path: '/guide', element: <Guide />, key: RouteKeys.guide },
  { path: '/towl', element: <TodoTask />, key: RouteKeys.todoTask },
  { path: '/:projectSlug/task/create/:projectId', element: <TaskCreate />, key: RouteKeys.taskCreate },
]
export const routes: CutomRouteObject[] = [
  { path: '/', element: <Events />, key: RouteKeys.events },
  { path: '/creator/:taskId', element: <Creator />, key: RouteKeys.creator },
  { path: '/projects', element: <Projects />, key: RouteKeys.projects },
  { path: '/:projectSlug/rank', element: <Contributionranks />, key: RouteKeys.contributionranks },
  { path: '/:projectSlug', element: <Project />, key: RouteKeys.project },
  { path: '/:projectSlug/:taskId', element: <Task />, key: RouteKeys.task },
  { path: '/ref/:refCode', element: <Ref />, key: RouteKeys.ref },
  { path: '*', element: <div>404</div>, key: RouteKeys.noMatch },
]

const Main: React.FC = () => {
  const { token, status } = useAppSelector(selectAccount)
  const isLogin = !!token
  const permissionRoutesMap = permissionRoutes.map((route) => ({
    ...route,
    element: isLogin ? route.element : <NoLogin>You have to connect wallet to view this page!</NoLogin>,
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
