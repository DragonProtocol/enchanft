/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 18:31:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 16:15:14
 * @Description: file description
 */
export enum AccountType {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  SOLANA = 'SOLANA',
  EVM = 'EVM',
  APTOS = 'APTOS',
}

export enum RoleType {
  CREATOR = 'CREATOR',
  COLLECTOR = 'COLLECTOR',
  ADMIN = 'ADMIN',
  VIP = 'VIP',
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

export type Account = {
  id: number;
  accountType: AccountType;
  thirdpartyId: string;
  thirdpartyName: string;
  userId: number;
  data: unknown;
};

export type User = {
  id: number;
  name: string;
  avatar: string;
  accounts: Account[];
  roles: RoleType[];
  resourcePermissions: ResourcePermission[];
  token: string;
};
