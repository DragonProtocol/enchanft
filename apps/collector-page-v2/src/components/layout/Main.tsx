/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-06 19:27:04
 * @Description: 站点主体内容（路由导航）
 */
import { useRoutes } from 'react-router-dom';
import styled from 'styled-components';
import { usePermissions, useWlUserReact } from '@ecnft/wl-user-react';
import { useCallback, useEffect } from 'react';
import {
  CutomRouteObject,
  permissionAdminRouteKeys,
  permissionLoginRouteKeys,
  routes,
} from '../../route/routes';
import { useAppDispatch } from '../../store/hooks';
import {
  fetchUserGroupFavorites,
  removeAllFavorites,
} from '../../features/favorite/userGroupFavorites';

function Main() {
  const dispatch = useAppDispatch();
  const { isLogin } = useWlUserReact();
  const { isAdmin } = usePermissions();
  // 获取用户相关信息
  useEffect(() => {
    if (!isLogin) {
      dispatch(removeAllFavorites());
      return;
    }
    dispatch(fetchUserGroupFavorites());
  }, [isLogin]);
  const renderElement = useCallback(
    (route: CutomRouteObject) => {
      if (isLogin) {
        // 是否是需要admin权限的route
        if (permissionAdminRouteKeys.includes(route.key)) {
          if (isAdmin) {
            return route.element;
          }
          return <NoPermission>Need Admin Permission</NoPermission>;
        }
        return route.element;
      }
      // 是否是需要login权限的route
      if (permissionLoginRouteKeys.includes(route.key)) {
        return <NoPermission>Need Login</NoPermission>;
      }
      return route.element;
    },
    [isLogin, isAdmin]
  );
  const routesMap = routes.map((item) => ({
    ...item,
    element: renderElement(item),
  }));
  const renderRoutes = useRoutes(routesMap);
  return <MainWrapper>{renderRoutes}</MainWrapper>;
}
export default Main;
const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
const NoPermission = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`;
