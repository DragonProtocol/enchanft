/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-09 14:13:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-10 18:38:14
 * @Description: file description
 */
import { useUs3rAuth, useUs3rAuthModal } from '@us3r-network/authkit';
import { useUs3rProfileContext } from '@us3r-network/profile';
import { useCallback, useEffect, useMemo } from 'react';
import { useU3Login } from '../contexts/U3LoginContext';
import { RoleType } from '../services/api/login';

export default () => {
  const { sessId } = useUs3rProfileContext();
  const { user, u3IsLogin, u3logout } = useU3Login();

  const { logout: us3rLogout } = useUs3rAuth();
  const { openLoginModal } = useUs3rAuthModal();
  const login = useCallback(() => {
    openLoginModal();
  }, [openLoginModal]);

  const logout = useCallback(() => {
    us3rLogout();
    u3logout();
  }, [us3rLogout, u3logout]);

  const isLogin = useMemo(() => !!sessId && u3IsLogin, [sessId, u3IsLogin]);

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

  const isAdmin = useMemo(() => user?.roles?.includes(RoleType.ADMIN), [user]);

  return {
    user,
    isLogin,
    isAdmin,
    login,
    logout,
    handleCallbackVerifyLogin,
  };
};
