/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:00:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-05 16:09:09
 * @Description: file description
 */
import { RouteObject } from 'react-router-dom';
import loadable from '@loadable/component';
import React, { ReactNode } from 'react';

export enum RouteKey {
  home = 'home',
  events = 'events',
  eventCreate = 'eventCreate',
  eventEdit = 'eventEdit',
  event = 'event',
  projects = 'projects',
  project = 'project',
  contents = 'contents',
  content = 'content',
  contentCreate = 'contentCreate',
  favorites = 'favorites',
  frens = 'frens',
  profile = 'profile',
  profileWallet = 'profileWallet',
  noMatch = 'noMatch',
}
export enum RoutePermission {
  login = 'login',
  admin = 'admin',
}
export type CutomRouteObject = RouteObject & {
  key: RouteKey;
  children?: Array<CutomRouteObject>;
  permissions?: RoutePermission[];
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
    path: '/events/:id',
    element: loadContainerElement('Events'),
    key: RouteKey.events,
  },
  {
    path: '/events/create',
    element: loadContainerElement('EventCreate'),
    key: RouteKey.eventCreate,
    permissions: [RoutePermission.login, RoutePermission.admin],
  },
  {
    path: '/events/:id/edit',
    element: loadContainerElement('EventEdit'),
    key: RouteKey.eventEdit,
    permissions: [RoutePermission.login, RoutePermission.admin],
  },
  {
    path: '/projects',
    element: loadContainerElement('Projects'),
    key: RouteKey.projects,
  },
  {
    path: '/projects/:id',
    element: loadContainerElement('Projects'),
    key: RouteKey.projects,
  },
  {
    path: '/contents/:id',
    element: loadContainerElement('Contents'),
    key: RouteKey.contents,
  },
  {
    path: '/contents/create',
    element: loadContainerElement('ContentCreate'),
    key: RouteKey.contentCreate,
    permissions: [RoutePermission.login],
  },
  {
    path: '/favorites',
    element: loadContainerElement('Favorites'),
    key: RouteKey.favorites,
    permissions: [RoutePermission.login],
  },
  {
    path: '/profile',
    element: loadContainerElement('Profile'),
    key: RouteKey.profile,
    permissions: [RoutePermission.login],
  },
  {
    path: '/profile/:wallet',
    element: loadContainerElement('Profile'),
    key: RouteKey.profileWallet,
    permissions: [RoutePermission.login],
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
