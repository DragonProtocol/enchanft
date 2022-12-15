/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 11:13:29
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-15 18:02:26
 * @Description: file description
 */
import { isArray, isString } from 'lodash';
import type { EventExploreListItem } from '../features/event/eventExploreList';
import DaylightSVg from '../components/imgs/daylight.svg';

export function daylightAbilityListToEventList(
  abilityList: any[]
): Array<EventExploreListItem> {
  return abilityList.map((ability) => ({
    id: ability.uid,
    name: ability.title,
    description: ability.description,
    image: ability.imageUrl,
    link: ability.action.linkUrl,
    chain: ability.chain,
    startTime: ability.openAt,
    endTime: ability.closeAt,
    reward: ability.type,
    project: {
      id: 0,
      name: ability.requirements[0].community?.title,
      description: ability.requirements[0].community?.description,
      image: ability.requirements[0].community?.imageUrl,
    },
    platform: {
      name: 'DAYLIGHT',
      logo: DaylightSVg,
    },
    isDaylight: true,
    supportIframe: true,
  }));
}

const HIDE_DAYLIGHT_STORAGE_KEY = 'hideDaylight';
export function addHideDaylightIdToStorage(uid: string) {
  const ids = getHideDaylightIdsByStorage();
  ids.push(uid);
  localStorage.setItem(HIDE_DAYLIGHT_STORAGE_KEY, JSON.stringify(ids));
}
export function getHideDaylightIdsByStorage(): string[] {
  try {
    const value = localStorage.getItem(HIDE_DAYLIGHT_STORAGE_KEY);
    const v = JSON.parse(value);
    if (isArray(v)) {
      return v;
    }
    if (isString(v)) {
      return [v];
    }
    return [];
  } catch (e) {
    return [];
  }
}
