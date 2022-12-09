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
      logo: '',
    },
    isDaylight: true,
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
