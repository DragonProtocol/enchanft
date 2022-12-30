import {
  AuthorizerType,
  useWlUserReact,
  WlUserActionType,
} from '@ecnft/wl-user-react';
import { useCallback } from 'react';
import { removeHomeBannerHiddenFromStore } from '../utils/homeStore';

export default () => {
  const wlUser = useWlUserReact();
  const { isLogin, dispatchAction } = wlUser;

  const login = useCallback(() => {
    dispatchAction({
      type: WlUserActionType.LOGIN,
      payload: AuthorizerType.EVM_WALLET_KIT,
    });
  }, [dispatchAction]);

  const logout = useCallback(() => {
    dispatchAction({ type: WlUserActionType.LOGOUT });
    removeHomeBannerHiddenFromStore();
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
