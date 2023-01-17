/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-13 11:23:58
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-17 17:23:31
 * @Description: 为action提供动力的辅助方法集合，用于得到正确的action配置
 */
import React from 'react';
import { BindResult, LoginResult } from '../api';
import Pubsub from '../utils/pubsub';
import {
  AuthorizerAction,
  AuthorizerActionProcessStatus,
  AuthorizerActionProviderElement,
  AuthorizerActionProviderComponentProps,
} from './authorizer';

// 通过静态方法创建的action配置
export type LoginActionStaticFunction = (
  onLoginProcess: (status: AuthorizerActionProcessStatus) => void,
  onLoginSuccess: (result: LoginResult) => void,
  onLoginError: (error: Error) => void
) => void;
export type BindActionStaticFunction = (
  token: string,
  onLoginProcess: (status: AuthorizerActionProcessStatus) => void,
  onLoginSuccess: (result: BindResult) => void,
  onLoginError: (error: Error) => void
) => void;
export const createActionConfigByStaticFunction = (
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

// 通过行为提供者组件创建的action配置
export const createActionConfigByProviderComponent = (
  ActionProviderComponent: React.FC<AuthorizerActionProviderComponentProps>
): {
  action: AuthorizerAction;
  actionProviderElement?: AuthorizerActionProviderElement;
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
    setLoginAction: (fn) => {
      action.login = fn;
    },
    setBindAction: (fn) => {
      action.bind = fn;
    },
  });
  return {
    action,
    actionProviderElement,
  };
};
