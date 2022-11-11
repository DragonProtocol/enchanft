/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:28:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-11 02:20:19
 * @Description: file description
 */
import { AccountType } from '../../../api';
import AuthProcessModal from '../../../components/AuthProcessModal/AuthProcessModal';
import {
  Authorizer,
  AuthorizerType,
  AuthorizerWebVersion,
  getActionPropertiesByActionProviderComponent,
} from '../../authorizer';
import { ActionProviderComponent } from './actionProviderComponent';
import iconUrl from './icon.svg';
export default (): Authorizer => {
  return {
    type: AuthorizerType.EVM_WALLET_KIT,
    accountType: AccountType.EVM,
    webVersion: AuthorizerWebVersion.web3,
    name: 'Evm Wallet Kit',
    bgColor: '#333333',
    nameColor: '#FFFFFF',
    iconUrl,
    authProcessComponent: AuthProcessModal,
    ...getActionPropertiesByActionProviderComponent(ActionProviderComponent),
  };
};
