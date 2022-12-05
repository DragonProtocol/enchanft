/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:00:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 19:32:48
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
    children: [
      {
        path: '/events/:id',
        element: loadContainerElement('Event'),
        key: RouteKey.event,
      },
    ],
  },
  {
    path: '/projects',
    element: loadContainerElement('Projects'),
    key: RouteKey.projects,
    children: [
      {
        path: '/projects/:id',
        element: loadContainerElement('Project'),
        key: RouteKey.project,
      },
    ],
  },
  {
    path: '/contents',
    element: loadContainerElement('Contents'),
    key: RouteKey.contents,
    children: [
      {
        path: '/contents/:id',
        element: loadContainerElement('Content'),
        key: RouteKey.content,
      },
    ],
  },
  {
    path: '/favorites',
    element: loadContainerElement('Favorites'),
    key: RouteKey.favorites,
    children: [
      {
        path: '/favorites/events/:id',
        element: loadContainerElement('Event'),
        key: RouteKey.event,
      },
      {
        path: '/favorites/projects/:id',
        element: loadContainerElement('Project'),
        key: RouteKey.project,
      },
    ],
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
  const searchRoute = (routeAry: CutomRouteObject[]) => {
    if (routeAry && routeAry.length) {
      for (const route of routeAry) {
        if (route.key === key) {
          return route;
        }
        searchRoute(route.children);
      }
    }
    return undefined;
  };
  return searchRoute(routes);
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
];
export const permissionRouteKeys = [RouteKey.profile, RouteKey.favorites];
