/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:00:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-01 16:26:21
 * @Description: file description
 */
import { RouteObject } from 'react-router-dom';
import loadable from '@loadable/component';
import React, { ReactNode } from 'react';

export enum RouteKeys {
  home = 'home',
  profile = 'profile',
  events = 'events',
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
  key: RouteKeys;
};

const loadComponent = (importPath: string): ReactNode => {
  const Component = loadable(() => import(`../container/${importPath}.tsx`));
  return React.createElement(Component);
};

export const permissionRoutes: CutomRouteObject[] = [
  {
    path: '/profile',
    element: loadComponent('Profile'),
    key: RouteKeys.profile,
  },
  { path: '/guide', element: loadComponent('Guide'), key: RouteKeys.guide },
  {
    path: '/towl',
    element: loadComponent('TodoTask'),
    key: RouteKeys.todoTask,
  },
  {
    path: '/:projectSlug/task/create/:projectId',
    element: loadComponent('TaskCreate'),
    key: RouteKeys.taskCreate,
  },
];
export const routes: CutomRouteObject[] = [
  { path: '/', element: loadComponent('Home'), key: RouteKeys.home },
  { path: '/events', element: loadComponent('Events'), key: RouteKeys.events },
  {
    path: '/projects',
    element: loadComponent('Projects'),
    key: RouteKeys.projects,
  },
  {
    path: '/:projectSlug/rank',
    element: loadComponent('Contributionranks'),
    key: RouteKeys.contributionranks,
  },
  {
    path: '/:projectSlug',
    element: loadComponent('Project'),
    key: RouteKeys.project,
  },
  {
    path: '/:projectSlug/:taskId',
    element: loadComponent('Task'),
    key: RouteKeys.task,
  },
  { path: '/ref/:refCode', element: loadComponent('Ref'), key: RouteKeys.ref },
  { path: '*', element: loadComponent('NoMatchRoute'), key: RouteKeys.noMatch },
];

export type CutomNavObject = {
  name: string;
  link: string;
  activeRouteKeys: RouteKeys[];
};
export const navs: CutomNavObject[] = [
  {
    name: 'home',
    link: '/',
    activeRouteKeys: [RouteKeys.home],
  },
  {
    name: 'events',
    link: '/events',
    activeRouteKeys: [RouteKeys.events, RouteKeys.todoTask, RouteKeys.task],
  },
  {
    name: 'projects',
    link: '/projects',
    activeRouteKeys: [
      RouteKeys.projects,
      RouteKeys.project,
      RouteKeys.contributionranks,
    ],
  },
];
