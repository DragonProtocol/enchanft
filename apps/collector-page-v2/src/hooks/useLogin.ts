import {
  AuthorizerType,
  useWlUserReact,
  WlUserActionType,
} from '@ecnft/wl-user-react';
import { useCallback } from 'react';

export default () => {
  const { isLogin, dispatchAction } = useWlUserReact();

  const login = useCallback(() => {
    dispatchAction({
      type: WlUserActionType.LOGIN,
      payload: AuthorizerType.EVM_WALLET_KIT,
    });
  }, [dispatchAction]);

  const logout = useCallback(() => {
    dispatchAction({ type: WlUserActionType.LOGOUT });
  }, [dispatchAction]);

  const handleLoginVerify = useCallback(
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
    login,
    logout,
    handleLoginVerify,
  };
};
