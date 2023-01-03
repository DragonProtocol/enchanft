/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 13:59:01
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-03 17:30:20
 * @Description: file description
 */
import React, { ReactNode } from 'react';
import { ReactComponent as HomeSvg } from '../components/common/icons/svgs/home.svg';
import { ReactComponent as ProfileSvg } from '../components/common/icons/svgs/profile.svg';
import { ReactComponent as FeedSvg } from '../components/common/icons/svgs/feed.svg';
import { ReactComponent as LikeSvg } from '../components/common/icons/svgs/like.svg';
import { ReactComponent as PlusSquareSvg } from '../components/common/icons/svgs/plus-square.svg';

import { CutomRouteObject, getRoute, RouteKey } from './routes';

export type CutomNavObject = {
  name: string;
  activeRouteKeys: RouteKey[];
  icon?: ReactNode;
  children?: CutomNavObject[];
  key?: string;
  route?: CutomRouteObject;
};
export const navs: CutomNavObject[] = [
  {
    name: 'home',
    activeRouteKeys: [RouteKey.home],
    icon: React.createElement(HomeSvg),
    route: getRoute(RouteKey.home),
  },
  {
    name: 'profile',
    activeRouteKeys: [RouteKey.profile],
    icon: React.createElement(ProfileSvg),
    route: getRoute(RouteKey.profile),
  },
  {
    key: 'feed',
    name: 'Feed',
    icon: React.createElement(FeedSvg),
    activeRouteKeys: [
      RouteKey.events,
      RouteKey.contents,
      RouteKey.frens,
      RouteKey.projects,
    ],
    route: getRoute(RouteKey.events),
  },
  {
    name: 'favorite',
    activeRouteKeys: [RouteKey.favorites],
    icon: React.createElement(LikeSvg),
    route: getRoute(RouteKey.favorites),
  },
  {
    key: 'feed-submit',
    name: 'Submit',
    icon: React.createElement(PlusSquareSvg),
    activeRouteKeys: [RouteKey.contentCreate],
    route: getRoute(RouteKey.contentCreate),
    children: [
      {
        name: 'content',
        activeRouteKeys: [RouteKey.contentCreate],
        route: getRoute(RouteKey.contentCreate),
      },
      {
        name: 'event',
        activeRouteKeys: [RouteKey.eventCreate],
        route: getRoute(RouteKey.eventCreate),
      },
    ],
  },
];
