/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 18:31:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-09 10:12:47
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

export interface WlUserError extends Error {
  code: number;
  data?: unknown;
}
export abstract class Signer {
  constructor(onError?: (error: WlUserError) => void) {
    this.onError = onError;
  }
  protected onError?: (error: WlUserError) => void;

  public abstract login(...args: unknown[]): Promise<void> | void;

  public abstract logout(...args: unknown[]): Promise<void> | void;

  public abstract bindAccount(...args: unknown[]): Promise<void> | void;

  public abstract unbindAccount(...args: unknown[]): Promise<void> | void;
}
