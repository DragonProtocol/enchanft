/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-09 14:13:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-10 18:38:14
 * @Description: file description
 */
import {
  AuthorizerType,
  User,
  useWlUserReact,
  WlUserActionType,
} from '@ecnft/wl-user-react';
import { useCallback, useEffect } from 'react';
import {
  removeU3ExtensionCookie,
  setU3ExtensionCookie,
  UserAdaptationCookie,
} from '../utils/cookie';
import { removeHomeBannerHiddenFromStore } from '../utils/homeStore';

export default () => {
  const wlUser = useWlUserReact();
  const { isLogin, dispatchAction, user } = wlUser;
  useEffect(() => {
    if (isLogin && user && (user as UserAdaptationCookie).tokenExpiresAt) {
      setU3ExtensionCookie(user);
    }
  }, [isLogin, user]);

  const login = useCallback(() => {
    dispatchAction({
      type: WlUserActionType.LOGIN,
      payload: AuthorizerType.EVM_WALLET_KIT,
    });
  }, [dispatchAction]);

  const logout = useCallback(() => {
    dispatchAction({ type: WlUserActionType.LOGOUT });
    removeHomeBannerHiddenFromStore();
    removeU3ExtensionCookie();
  }, [dispatchAction]);

  const handleCallbackVerifyLogin = useCallback(
    (callback?: () => void) => {
      if (!isLogin) {
        login();
      } else if (callback) {
        callback();
      }
    },
    [isLogin, login]
  );

  return {
    ...wlUser,
    login,
    logout,
    handleCallbackVerifyLogin,
  };
};
