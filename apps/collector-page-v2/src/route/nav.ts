/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 13:59:01
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-13 16:26:40
 * @Description: file description
 */
import HomeSvg from '../components/common/icons/svgs/home.svg';
import ProfileSvg from '../components/common/icons/svgs/profile.svg';
import FeedSvg from '../components/common/icons/svgs/feed.svg';
import LikeSvg from '../components/common/icons/svgs/like.svg';
import { getRoute, RouteKey } from './routes';

export type CutomNavObject = {
  name: string;
  link: string;
  activeRouteKeys: RouteKey[];
  iconUrl?: string;
  navs?: CutomNavObject[];
};
export const navs: CutomNavObject[] = [
  {
    name: 'home',
    link: getRoute(RouteKey.home).path,
    activeRouteKeys: [RouteKey.home],
    iconUrl: HomeSvg,
  },
  {
    name: 'profile',
    link: getRoute(RouteKey.profile).path,
    activeRouteKeys: [RouteKey.profile],
    iconUrl: ProfileSvg,
  },
  {
    name: 'Feed',
    iconUrl: FeedSvg,
    link: '',
    activeRouteKeys: [],
    navs: [
      {
        name: 'events',
        link: getRoute(RouteKey.events).path,
        activeRouteKeys: [RouteKey.events, RouteKey.event],
      },
      {
        name: 'contents',
        link: getRoute(RouteKey.contents).path,
        activeRouteKeys: [RouteKey.contents, RouteKey.content],
      },
      {
        name: 'frens',
        link: getRoute(RouteKey.frens).path,
        activeRouteKeys: [RouteKey.frens, RouteKey.frens],
      },
      {
        name: 'projects',
        link: getRoute(RouteKey.projects).path,
        activeRouteKeys: [RouteKey.projects, RouteKey.project],
      },
    ],
  },
  {
    name: 'favorite',
    link: getRoute(RouteKey.favorites).path,
    activeRouteKeys: [RouteKey.favorites],
    iconUrl: LikeSvg,
  },
];

export type CutomSubmitNavObject = {
  name: string;
  link: string;
  activeRouteKeys: RouteKey[];
};
export const submitNavs: CutomNavObject[] = [
  {
    name: 'submit content',
    link: getRoute(RouteKey.contentCreate).path,
    activeRouteKeys: [RouteKey.contentCreate],
  },
  {
    name: 'submit event',
    link: getRoute(RouteKey.eventCreate).path,
    activeRouteKeys: [RouteKey.eventCreate],
  },
];
