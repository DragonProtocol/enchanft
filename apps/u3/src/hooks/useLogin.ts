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
import {
  AuthToolType,
  useUs3rAuth,
  useUs3rAuthModal,
} from '@us3r-network/authkit';
import { useUs3rProfileContext } from '@us3r-network/profile';
import { useCallback, useEffect, useMemo } from 'react';
import {
  removeU3ExtensionCookie,
  setU3ExtensionCookie,
  UserAdaptationCookie,
} from '../utils/cookie';
import { removeHomeBannerHiddenFromStore } from '../utils/homeStore';

const authToolTypeToWlUserAuthorizerTypeMap = {
  [AuthToolType.metamask_wallet]: AuthorizerType.METAMASK_WALLET,
  [AuthToolType.phantom_wallet]: AuthorizerType.PHANTOM_WALLET,
};
let needWlUserLogin = true;
export default () => {
  // us3r
  const { sessId } = useUs3rProfileContext();
  const { logout: us3rLogout, lastAuthToolType } = useUs3rAuth();
  const { openLoginModal } = useUs3rAuthModal();
  const login = useCallback(() => {
    openLoginModal();
  }, [openLoginModal]);

  // wl-user
  const wlUser = useWlUserReact();
  const { dispatchAction, user, isLogin: wlIsLogin } = wlUser;
  useEffect(() => {
    if (wlIsLogin && user && (user as UserAdaptationCookie).tokenExpiresAt) {
      setU3ExtensionCookie(user);
    }
  }, [wlIsLogin, user]);

  const isLogin = useMemo(() => !!sessId && wlIsLogin, [sessId, wlIsLogin]);

  // us3r 登录后，登录wl-user
  useEffect(() => {
    if (sessId && !wlIsLogin && needWlUserLogin) {
      needWlUserLogin = false;
      const wlUserAuthorizerType =
        authToolTypeToWlUserAuthorizerTypeMap[lastAuthToolType];
      dispatchAction({
        type: WlUserActionType.LOGIN,
        payload: wlUserAuthorizerType,
      });
    }
  }, [sessId, lastAuthToolType, wlIsLogin, dispatchAction]);

  const wLlogout = useCallback(() => {
    dispatchAction({ type: WlUserActionType.LOGOUT });
    removeHomeBannerHiddenFromStore();
    removeU3ExtensionCookie();
  }, [dispatchAction]);

  const logout = useCallback(() => {
    us3rLogout();
    wLlogout();
    setTimeout(() => {
      needWlUserLogin = true;
    }, 2000);
  }, [us3rLogout, wLlogout]);

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
    isLogin,
    login,
    logout,
    handleCallbackVerifyLogin,
  };
};
