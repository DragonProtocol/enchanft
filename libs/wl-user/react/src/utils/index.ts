/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 18:19:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-17 17:12:24
 * @Description: file description
 */
import { User } from '../api';
import { Authorizer, AuthorizerWebVersion } from '../authorizers/authorizer';

export const openOauthWindow = (url: string): WindowProxy | null =>
  window.open(
    url,
    '__blank',
    'width=480,height=800,top=0,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no'
  );
export const listenWindowClose = (win: Window, closeCallback: () => void) => {
  const interval = setInterval(() => {
    if (win.closed) {
      clearInterval(interval);
      closeCallback();
    }
  }, 250);
};
export const getAccountDisplayName = (user: User, authorizer: Authorizer) => {
  const account = user.accounts.find(
    (item) => item.accountType === authorizer.accountType
  );
  if (account) {
    if (
      authorizer.webVersion === AuthorizerWebVersion.web2 &&
      account.thirdpartyName
    ) {
      return account.thirdpartyName;
    }
    if (
      authorizer.webVersion === AuthorizerWebVersion.web3 &&
      account.thirdpartyId
    ) {
      return `${account.thirdpartyId.slice(0, 4)}..${account.thirdpartyId.slice(
        -4
      )}`;
    }
  }
  return '';
};
export const getUserDisplayName = (user: User, authorizer: Authorizer) => {
  if (user.name) return user.name;
  return getAccountDisplayName(user, authorizer);
};
