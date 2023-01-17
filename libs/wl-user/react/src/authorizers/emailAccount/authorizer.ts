/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:28:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-18 10:48:06
 * @Description: file description
 */
import { AccountType } from '../../api';
import { createActionConfigByProviderComponent } from '../actionConfig';
import {
  Authorizer,
  AuthorizerType,
  AuthorizerWebVersion,
} from '../authorizer';
import ActionProviderComponent from './actionProviderComponent';
import iconUrl from './icon.svg';

export default (): Authorizer => ({
  type: AuthorizerType.EMAIL,
  accountType: AccountType.EMAIL,
  webVersion: AuthorizerWebVersion.web2,
  name: 'Email',
  bgColor: '#3DD606',
  nameColor: '#FFFFFF',
  iconUrl,
  ...createActionConfigByProviderComponent(ActionProviderComponent),
});
