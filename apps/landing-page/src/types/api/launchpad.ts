/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-24 10:49:22
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-28 14:13:27
 * @FilePath: \synft-app\src\types\api\launchpad.ts
 * @Description: launch api types
 */
// 项目方信息
export type ProjectPartyItem = {
  id: string;
  name: string;
};
// 项目信息
export type ProjectItem = {
  id: string;
  img: string;
  name: string;
  homeUrl: string;
  twitterUrl: string;
  discordUrl: string;
  desc: string;
  itemsNum: number;
  price: number;
  enchanfted: number;
  projectParty: ProjectPartyItem;
};
