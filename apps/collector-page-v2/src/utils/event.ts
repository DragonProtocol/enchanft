/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-26 17:20:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-26 17:29:38
 * @Description: file description
 */
const EVENT_COMPLETE_GUIDE_KEY = 'EVENT_COMPLETE_GUIDE';
export function getEventCompleteGuideForStore(): number {
  return Number(localStorage.getItem(EVENT_COMPLETE_GUIDE_KEY));
}

export function setEventCompleteGuideEndToStore() {
  localStorage.setItem(EVENT_COMPLETE_GUIDE_KEY, '1');
}

export function verifyEventCompleteGuideEndByStore(): boolean {
  return getEventCompleteGuideForStore() === 1;
}
