/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:00:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-14 11:09:48
 * @Description: file description
 */
import { RouteObject } from 'react-router-dom'
import loadable from '@loadable/component'
import React, { ReactNode } from 'react'

export enum RouteKeys {
  profile = 'profile',
  events = 'events',
  creator = 'creator',
  todoTask = 'todoTask',
  guide = 'guide',
  news = 'news',
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

const loadComponent = (importPath: string): ReactNode => {
  const Component = loadable(() => import(`../container/${importPath}.tsx`))
  return React.createElement(Component)
}

export const permissionRoutes: CutomRouteObject[] = [
  { path: '/profile', element: loadComponent('Profile'), key: RouteKeys.profile },
  { path: '/guide', element: loadComponent('Guide'), key: RouteKeys.guide },
  { path: '/news', element: loadComponent('News'), key: RouteKeys.news },
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
  { path: '/news/:orbis_channel_id', element: loadComponent('News'), key: RouteKeys.news },
  { path: '*', element: loadComponent('NoMatchRoute'), key: RouteKeys.noMatch },
]

export type CutomNavObject = {
  name: string
  link: string
  activeRouteKeys: RouteKeys[]
}
export const navs: CutomNavObject[] = [
  {
    name: 'events',
    link: '/',
    activeRouteKeys: [RouteKeys.events, RouteKeys.todoTask, RouteKeys.task],
  },
  {
    name: 'projects',
    link: '/projects',
    activeRouteKeys: [RouteKeys.projects, RouteKeys.project, RouteKeys.contributionranks],
  },
  {
    name: 'news',
    link: '/news',
    activeRouteKeys: [RouteKeys.news],
  },
]