/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:28:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-13 12:25:40
 * @Description: file description
 */
import { AccountType } from '../../../api';
import AuthProcessModal from '../../../components/AuthProcessModal/AuthProcessModal';
import { createActionConfigByProviderComponent } from '../../actionConfig';
import {
  Authorizer,
  AuthorizerType,
  AuthorizerWebVersion,
} from '../../authorizer';
import { ActionProviderComponent } from './actionProviderComponent';
import iconUrl from './icon.svg';

export default (): Authorizer => ({
  type: AuthorizerType.EVM_WALLET_KIT,
  accountType: AccountType.EVM,
  webVersion: AuthorizerWebVersion.web3,
  name: 'Evm Wallet Kit',
  bgColor: '#F6851B',
  nameColor: '#FFFFFF',
  iconUrl,
  actionProcessComponent: AuthProcessModal,
  ...createActionConfigByProviderComponent(ActionProviderComponent),
});
