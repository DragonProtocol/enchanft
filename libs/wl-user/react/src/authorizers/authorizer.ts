/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:08:46
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-13 12:38:14
 * @Description: file description
 */
import React from 'react';
import { AccountType, BindResult, LoginResult } from '../api';
export enum AuthorizerType {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  METAMASK_WALLET = 'METAMASK_WALLET',
  PHANTOM_WALLET = 'PHANTOM_WALLET',
  MARTIAN_WALLET = 'MARTIAN_WALLET',
  EVM_WALLET_KIT = 'EVM_WALLET_KIT',
}
export enum AuthorizerWebVersion {
  web2 = 'web2',
  web3 = 'web3',
}
export enum AuthorizerActionProcessStatus {
  IDLE = 'IDLE',
  SIGNATURE_PENDING = 'SIGNATURE_PENDING',
  SIGNATURE_FULFILLED = 'SIGNATURE_FULFILLED',
  SIGNATURE_REJECTED = 'SIGNATURE_REJECTED',
  API_PENDING = 'API_PENDING',
  API_FULFILLED = 'API_FULFILLED',
  API_REJECTED = 'API_REJECTED',
}
export type AuthorizerActionListener<SuccessResult> = (listeners: {
  process?: (status: AuthorizerActionProcessStatus) => void;
  success?: (result: SuccessResult) => void;
  error?: (error: Error) => void;
}) => void;

export type AuthorizerAction = {
  login: () => void;
  bind: (token: string) => void;
  loginListener: AuthorizerActionListener<LoginResult>;
  bindListener: AuthorizerActionListener<BindResult>;
};

export type AuthorizerActionProcessComponentProps = {
  authorizer: Authorizer;
};

export type AuthorizerActionProviderComponentProps = {
  onLoginProcess: (status: AuthorizerActionProcessStatus) => void;
  onLoginSuccess: (result: LoginResult) => void;
  onLoginError: (error: Error) => void;
  onBindProcess: (status: AuthorizerActionProcessStatus) => void;
  onBindSuccess: (result: BindResult) => void;
  onBindError: (error: Error) => void;
  setLoginAction: (fn: () => void) => void;
  setBindAction: (fn: () => void) => void;
};

export type AuthorizerActionProviderElement =
  React.FunctionComponentElement<AuthorizerActionProviderComponentProps>;

export type AuthorizerActionProcessComponent =
  React.FC<AuthorizerActionProcessComponentProps>;

export type Authorizer = {
  // 授权者类型,标志着使用什么方式授权
  type: AuthorizerType;
  // 账户类型
  accountType: AccountType;
  // web 版本，为处理数据提供的约束/协议
  webVersion: AuthorizerWebVersion;
  // 授权者名称
  name: string;
  // 符合授权者的背景色
  bgColor: string;
  // 符合授权者名称的文字颜色
  nameColor: string;
  // 符合授权者的图标地址
  iconUrl: string;
  // 授权者具备的行为
  action: AuthorizerAction;
  // 如果授权者的行为不能直接通过普通函数赋予，而需要某些特定的react组件提供，则需要预先创建行为提供者元素
  actionProviderElement?: AuthorizerActionProviderElement;
  // 行为执行流程组件
  actionProcessComponent?: AuthorizerActionProcessComponent;
};
