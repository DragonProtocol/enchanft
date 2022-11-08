/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:08:46
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-08 19:35:10
 * @Description: file description
 */
import { AccountType, BindResult, LoginResult } from '../api';

export enum AuthorizerType {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  METAMASK = 'METAMASK',
  PHANTOM = 'PHANTOM',
  MARTIAN = 'MARTIAN',
  RAINBOWKIT = 'RAINBOWKIT',
}
export type AuthorizerActionProviderProps = {
  loginSuccess: (reault: LoginResult) => void;
  bindSuccess: (reault: BindResult) => void;
  setDisptch: (dispatch: (actionType: AuthorizerActionType) => void) => void;
};
export enum AuthorizerActionType {
  LOGIN = 'LOGIN',
  BIND = 'BIND',
}
export type AccountAuthorizer = {
  authorizerType: AuthorizerType;
  accountType: AccountType;
  name: string;
  bgColor: string;
  nameColor: string;
  iconUrl: string | (() => Promise<string>);
  dispatch?: (actionType: AuthorizerActionType) => void;
  actionProvider?: React.FC<AuthorizerActionProviderProps>;
};
