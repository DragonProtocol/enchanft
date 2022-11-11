/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:08:46
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-11 18:14:18
 * @Description: file description
 */
import React from 'react';
import { AccountType, BindResult, LoginResult } from '../api';
import { Pubsub } from '../utils/pubsub';
export const SIGN_MSG = `Please sign this message.
We cannot initiate a transfer of any of your cryptocurrency or digital assets or otherwise access your digital assets.`;
export enum AuthorizerType {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  METAMASK_WALLET = 'METAMASK_WALLET',
  PHANTOM_WALLET = 'PHANTOM_WALLET',
  MARTIAN_WALLET = 'MARTIAN_WALLET',
  EVM_WALLET_KIT = 'EVM_WALLET_KIT',
}
export enum AuthActionProcessStatus {
  IDLE = 'IDLE',
  SIGNATURE_PENDING = 'SIGNATURE_PENDING',
  SIGNATURE_FULFILLED = 'SIGNATURE_FULFILLED',
  SIGNATURE_REJECTED = 'SIGNATURE_REJECTED',
  API_PENDING = 'API_PENDING',
  API_FULFILLED = 'API_FULFILLED',
  API_REJECTED = 'API_REJECTED',
}
export enum AuthorizerWebVersion {
  web2 = 'web2',
  web3 = 'web3',
}
export type AuthActionListener<SuccessResult> = (listeners: {
  process?: (status: AuthActionProcessStatus) => void;
  success?: (result: SuccessResult) => void;
  error?: (error: Error) => void;
}) => void;

export type AuthorizerAction = {
  login: () => void;
  bind: (token: string) => void;
  loginListener: AuthActionListener<LoginResult>;
  bindListener: AuthActionListener<BindResult>;
};

export type AuthProcessComponentProps = {
  authorizer: Authorizer;
};

export type ActionProviderComponentProps = {
  onLoginProcess: (status: AuthActionProcessStatus) => void;
  onLoginSuccess: (result: LoginResult) => void;
  onLoginError: (error: Error) => void;
  onBindProcess: (status: AuthActionProcessStatus) => void;
  onBindSuccess: (result: BindResult) => void;
  onBindError: (error: Error) => void;
  setLoginAction: (fn: () => void) => void;
  setBindAction: (fn: () => void) => void;
};

export type Authorizer = {
  type: AuthorizerType;
  accountType: AccountType;
  webVersion: AuthorizerWebVersion;
  name: string;
  bgColor: string;
  nameColor: string;
  iconUrl: string;
  action: AuthorizerAction;
  actionProviderElement?: React.FunctionComponentElement<ActionProviderComponentProps>;
  authProcessComponent?: React.FC<AuthProcessComponentProps>;
};

export type LoginActionStaticFunction = (
  onLoginProcess: (status: AuthActionProcessStatus) => void,
  onLoginSuccess: (result: LoginResult) => void,
  onLoginError: (error: Error) => void
) => void;
export type BindActionStaticFunction = (
  token: string,
  onLoginProcess: (status: AuthActionProcessStatus) => void,
  onLoginSuccess: (result: BindResult) => void,
  onLoginError: (error: Error) => void
) => void;
export const getActionByActionStaticFunction = (
  loginAction: LoginActionStaticFunction,
  bindAction: BindActionStaticFunction
): AuthorizerAction => {
  const pubsub = new Pubsub();
  return {
    login: () =>
      loginAction(
        (status) => pubsub.trigger('loginProcess', status),
        (result) => pubsub.trigger('loginSuccess', result),
        (error) => pubsub.trigger('loginError', error)
      ),
    bind: (token) =>
      bindAction(
        token,
        (status) => pubsub.trigger('bindProcess', status),
        (result) => pubsub.trigger('bindSuccess', result),
        (error) => pubsub.trigger('bindError', error)
      ),
    loginListener: ({ process, success, error }) => {
      pubsub.listen('loginProcess', process);
      pubsub.listen('loginSuccess', success);
      pubsub.listen('loginError', error);
    },
    bindListener: ({ process, success, error }) => {
      pubsub.listen('bindProcess', process);
      pubsub.listen('bindSuccess', success);
      pubsub.listen('bindError', error);
    },
  };
};
export const getActionPropertiesByActionProviderComponent = (
  ActionProviderComponent: React.FC<ActionProviderComponentProps>
): {
  action: AuthorizerAction;
  actionProviderElement?: React.FunctionComponentElement<ActionProviderComponentProps>;
} => {
  const pubsub = new Pubsub();
  const action: AuthorizerAction = {
    login: () => {},
    bind: () => {},
    loginListener: ({ process, success, error }) => {
      pubsub.listen('loginProcess', process);
      pubsub.listen('loginSuccess', success);
      pubsub.listen('loginError', error);
    },
    bindListener: ({ process, success, error }) => {
      pubsub.listen('bindProcess', process);
      pubsub.listen('bindSuccess', success);
      pubsub.listen('bindError', error);
    },
  };
  const actionProviderElement = React.createElement(ActionProviderComponent, {
    onLoginProcess: (status) => pubsub.trigger('loginProcess', status),
    onLoginSuccess: (result) => pubsub.trigger('loginSuccess', result),
    onLoginError: (error) => pubsub.trigger('loginError', error),
    onBindProcess: (status) => pubsub.trigger('bindProcess', status),
    onBindSuccess: (result) => pubsub.trigger('bindSuccess', result),
    onBindError: (error) => pubsub.trigger('bindError', error),
    setLoginAction: (fn) => (action.login = fn),
    setBindAction: (fn) => (action.bind = fn),
  });
  return {
    action,
    actionProviderElement,
  };
};
