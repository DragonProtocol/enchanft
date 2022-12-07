/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:00:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-06 19:29:48
 * @Description: file description
 */
import { RouteObject } from 'react-router-dom';
import loadable from '@loadable/component';
import React, { ReactNode } from 'react';

export enum RouteKey {
  home = 'home',
  events = 'events',
  event = 'event',
  projects = 'projects',
  project = 'project',
  contents = 'contents',
  content = 'content',
  contentCreate = 'contentCreate',
  favorites = 'favorites',
  frens = 'frens',
  profile = 'profile',
  noMatch = 'noMatch',
}

export type CutomRouteObject = RouteObject & {
  key: RouteKey;
  children?: Array<CutomRouteObject>;
};

const loadContainerElement = (fileName: string): ReactNode => {
  const Component = loadable(() => import(`../container/${fileName}.tsx`));
  return React.createElement(Component);
};
export const NoMatchRoute: CutomRouteObject = {
  path: '*',
  element: loadContainerElement('NoMatchRoute'),
  key: RouteKey.noMatch,
};
export const routes: CutomRouteObject[] = [
  { path: '/', element: loadContainerElement('Home'), key: RouteKey.home },
  {
    path: '/events',
    element: loadContainerElement('Events'),
    key: RouteKey.events,
  },
  {
    path: '/projects',
    element: loadContainerElement('Projects'),
    key: RouteKey.projects,
  },
  {
    path: '/contents',
    element: loadContainerElement('Contents'),
    key: RouteKey.contents,
  },
  {
    path: '/contents/create',
    element: loadContainerElement('ContentCreate'),
    key: RouteKey.contentCreate,
  },
  {
    path: '/favorites',
    element: loadContainerElement('Favorites'),
    key: RouteKey.favorites,
  },
  {
    path: '/profile',
    element: loadContainerElement('Profile'),
    key: RouteKey.profile,
  },
  {
    path: '/frens',
    element: loadContainerElement('Frens'),
    key: RouteKey.frens,
  },
  NoMatchRoute,
];

export const getRoute = (key: RouteKey): CutomRouteObject | undefined => {
  let route: CutomRouteObject | undefined;
  const searchRoute = (routeAry: CutomRouteObject[]) => {
    for (const item of routeAry) {
      if (item.key === key) {
        route = item;
      } else if (item.children?.length) {
        searchRoute(item.children);
      }
      if (route) return;
    }
  };
  searchRoute(routes);
  return route;
};
export type CutomNavObject = {
  name: string;
  link: string;
  activeRouteKeys: RouteKey[];
};
export const navs: CutomNavObject[] = [
  {
    name: 'home',
    link: getRoute(RouteKey.home).path,
    activeRouteKeys: [RouteKey.home],
  },
  {
    name: 'events',
    link: getRoute(RouteKey.events).path,
    activeRouteKeys: [RouteKey.events, RouteKey.event],
  },
  {
    name: 'projects',
    link: getRoute(RouteKey.projects).path,
    activeRouteKeys: [RouteKey.projects, RouteKey.project],
  },
  {
    name: 'contents',
    link: getRoute(RouteKey.contents).path,
    activeRouteKeys: [RouteKey.contents, RouteKey.content],
  },
  {
    name: 'profile',
    link: getRoute(RouteKey.profile).path,
    activeRouteKeys: [RouteKey.profile],
  },
  {
    name: 'favorites',
    link: getRoute(RouteKey.favorites).path,
    activeRouteKeys: [RouteKey.favorites],
  },
  {
    name: 'add content',
    link: getRoute(RouteKey.contentCreate).path,
    activeRouteKeys: [RouteKey.contentCreate],
  },
];

// 需要登录权限的路由
export const permissionLoginRouteKeys = [
  RouteKey.profile,
  RouteKey.favorites,
  RouteKey.contentCreate,
];

// 需要admin权限的路由
export const permissionAdminRouteKeys = [
  // RouteKey.contentCreate
];
