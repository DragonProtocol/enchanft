/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 13:59:01
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-30 11:59:55
 * @Description: file description
 */
import { ReactComponent as HomeSvg } from '../components/common/icons/svgs/home.svg';
import { ReactComponent as ProfileSvg } from '../components/common/icons/svgs/profile.svg';
import { ReactComponent as FeedSvg } from '../components/common/icons/svgs/feed.svg';
import { ReactComponent as LikeSvg } from '../components/common/icons/svgs/like.svg';
import { ReactComponent as PlusSquareSvg } from '../components/common/icons/svgs/plus-square.svg';

import { CutomRouteObject, getRoute, RouteKey } from './routes';

export type CutomNavObject = {
  name: string;
  activeRouteKeys: RouteKey[];
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  children?: CutomNavObject[];
  key?: string;
  route?: CutomRouteObject;
};
export const navs: CutomNavObject[] = [
  {
    name: 'home',
    activeRouteKeys: [RouteKey.home],
    icon: HomeSvg,
    route: getRoute(RouteKey.home),
  },
  {
    name: 'profile',
    activeRouteKeys: [RouteKey.profile],
    icon: ProfileSvg,
    route: getRoute(RouteKey.profile),
  },
  {
    key: 'feed',
    name: 'Feed',
    icon: FeedSvg,
    activeRouteKeys: [],
    children: [
      {
        name: 'events',
        activeRouteKeys: [RouteKey.events, RouteKey.event],
        route: getRoute(RouteKey.events),
      },
      {
        name: 'contents',
        activeRouteKeys: [RouteKey.contents, RouteKey.content],
        route: getRoute(RouteKey.contents),
      },
      {
        name: 'frens',
        activeRouteKeys: [RouteKey.frens, RouteKey.frens],
        route: getRoute(RouteKey.frens),
      },
      {
        name: 'projects',
        activeRouteKeys: [RouteKey.projects, RouteKey.project],
        route: getRoute(RouteKey.projects),
      },
    ],
  },
  {
    name: 'favorite',
    activeRouteKeys: [RouteKey.favorites],
    icon: LikeSvg,
    route: getRoute(RouteKey.favorites),
  },
  {
    key: 'feed-submit',
    name: 'Submit',
    icon: PlusSquareSvg,
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
