/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:28:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-08 19:44:25
 * @Description: file description
 */
import React from 'react';
import { AccountType } from '../../../../api';
import {
  AccountAuthorizer,
  AuthorizerType,
  AuthorizerActionType,
} from '../../../account';
import { ActionProvider } from './actionProvider';
export default (): AccountAuthorizer => {
  return {
    accountType: AccountType.EVM,
    authorizerType: AuthorizerType.RAINBOWKIT,
    name: 'Evm Wallet',
    bgColor: '#333333',
    nameColor: '#FFFFFF',
    iconUrl: async () => (await import('./metamask_bg_white.svg')).default,
    actionProvider: ActionProvider,
  };
};
