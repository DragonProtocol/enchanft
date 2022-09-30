/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 18:31:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-30 18:24:27
 * @Description: file description
 */

export enum AccountType {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  SOLANA = 'SOLANA',
  EVM = 'EVM',
  APTOS = 'APTOS',
}

export type AccountLink = {
  accountType: AccountType;
  id: number;
  thirdpartyId: string;
  thirdpartyName: string;
  userId: number;
};
export enum RoleType {
  CREATOR = 'CREATOR',
  COLLECTOR = 'COLLECTOR',
}

export enum ResourceType {
  TASK = 'TASK',
  PROJECT = 'PROJECT',
  COMMUNITY = 'COMMUNITY',
}
export type ResourcePermission = {
  resourceType: ResourceType;
  resourceIds: number[];
};

export type LoginResult = {
  token: string;
  id: number;
  name: string;
  avatar: string;
  pubkey: string;
  accounts: AccountLink[];
  roles: RoleType[];
  resourcePermissions: ResourcePermission[];
};

export enum ErrorTypes {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  METAMASK = 'METAMASK',
  PHANTOM = 'PHANTOM',
  APTOS = 'APTOS',
}

export type Error = {
  type: ErrorTypes;
  message: string;
};
