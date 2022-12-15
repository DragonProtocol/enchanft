/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 14:05:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 17:08:21
 * @Description: file description
 */
import { ApiResp } from '.';

export enum OrderBy {
  EARLIEST = 'EARLIEST',
  TRENDING = 'TRENDING',
  NEWEST = 'NEWEST',
  FORU = 'FORU',
}

export enum Platform {
  GALXE = 'GALXE',
  NOOX = 'NOOX',
  POAP = 'POAP',
  QUEST3 = 'QUEST3',
  RABBIT_HOLE = 'RABBIT_HOLE',
  LINK3 = 'LINK3',
}

export enum Reward {
  BADGE = 'BADGE',
  NFT = 'NFT',
  TOKEN = 'TOKEN',
  WL = 'WL',
}

export enum ProjectType {
  DAO = 'DAO',
  DEFI = 'DEFI',
  GAME = 'GAME',
  NFT = 'NFT',
}

export enum TagType {
  SOCIAL = 'social',
  TRANSACTION = 'transaction',
  EXCHANGE = 'exchange',
  COLLECTIBLE = 'collectible',
  DONATION = 'donation',
  GOVERNANCE = 'governance',
}

export enum PlatformLogo {
  GALXE = 'https://galxe.com/favicon.ico',
  NOOX = 'https://noox.world/favicon.ico',
  POAP = 'https://poap.xyz/favicon-32x32.dba5403f.png',
  QUEST3 = 'https://quest3.xyz/favicon.ico',
}
export type PlatformsItemResponse = {
  platform: string;
  platformLogo: string;
  eventNumber: number;
};
export type PlatformsResponse = ApiResp<Array<PlatformsItemResponse>>;
