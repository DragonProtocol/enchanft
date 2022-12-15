/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 11:13:29
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 17:49:18
 * @Description: file description
 */
import type { EventExploreListItem } from '../features/event/eventExploreList';

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
      name: '',
      logo: '',
    },
    isDaylight: true,
    supportIframe: true,
  }));
}

const HIDE_DAYLIGHT_STORAGE_KEY = 'hideDaylight';
export function addHideDaylightIdToStorage(uid: string) {
  const value = localStorage.getItem(HIDE_DAYLIGHT_STORAGE_KEY);
  let ids = [];
  try {
    ids = (JSON.parse(value) || []).push(uid);
    return ids;
  } catch (e) {
    ids = [uid];
    return ids;
  } finally {
    localStorage.setItem(HIDE_DAYLIGHT_STORAGE_KEY, JSON.stringify(ids));
  }
}
export function getHideDaylightIdsByStorage(): string[] {
  const value = localStorage.getItem(HIDE_DAYLIGHT_STORAGE_KEY);
  try {
    return JSON.parse(value) || [];
  } catch (e) {
    return [];
  }
}
