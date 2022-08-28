/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-25 15:10:01
 * @Description: 站点主体内容（路由导航）
 */

import React, { useEffect } from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'
import styled from 'styled-components'
import loadable from "@loadable/component";

import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectAccount, userLink } from '../../features/user/accountSlice'

// import Guide from '../../container/Guide'
// import Task from '../../container/Task'
// import TaskCreate from '../../container/TaskCreate'
// import Projects from '../../container/Projects'
// import Project from '../../container/Project'
// import Contributionranks from '../../container/Contributionranks'
// import Ref from '../../container/Ref'
// import Creator from '../../container/Creator'
// import Profile from '../../container/Profile'
// import Events from '../../container/Events'
// import TodoTask from '../../container/TodoTask'

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

const loadComponent = (importPath: string) => {
  const Component = loadable(() => import(`../../container/${importPath}.tsx`))
  return <Component/>
}
  

export const permissionRoutes: CutomRouteObject[] = [
  { path: '/profile', element: loadComponent('Profile'), key: RouteKeys.profile },
  { path: '/guide', element: loadComponent('Guide'), key: RouteKeys.guide },
  { path: '/towl', element: loadComponent('TodoTask'), key: RouteKeys.todoTask },
  { path: '/:projectSlug/task/create/:projectId', element: loadComponent('TaskCreate'), key: RouteKeys.taskCreate },
]
export const routes: CutomRouteObject[] = [
  { path: '/', element: loadComponent('Events'), key: RouteKeys.events },
  { path: '/creator/:taskId', element: loadComponent('Creator'), key: RouteKeys.creator },
  { path: '/projects', element: loadComponent('Projects'), key: RouteKeys.projects },
  { path: '/:projectSlug/rank', element: loadComponent('Contributionranks'), key: RouteKeys.contributionranks },
  { path: '/:projectSlug', element: loadComponent('Project'), key: RouteKeys.project },
  { path: '/:projectSlug/:taskId', element: loadComponent('Task'), key: RouteKeys.task },
  { path: '/ref/:refCode', element: loadComponent('Ref'), key: RouteKeys.ref },
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
