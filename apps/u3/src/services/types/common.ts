/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 14:05:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-17 14:20:09
 * @Description: file description
 */
import { ApiResp } from '.';

export enum ChainType {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
  BSC = 'BSC',
  MATIC = 'MATIC',
  APTOS = 'APTOS',
}

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

export type ConfigTopicsChain = {
  chainEnum: string;
  image: string;
  link: string;
  name: string;
};
export type ConfigTopics = {
  eventRewards: string[];
  eventTypes: string[];
  projectTypes: string[];
  contentTypes: string[];
  langs: string[];
  chains: ConfigTopicsChain[];
};
export type ConfigTopicsResponse = ApiResp<ConfigTopics>;
