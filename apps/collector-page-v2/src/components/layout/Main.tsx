/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-28 13:16:02
 * @Description: 站点主体内容（路由导航）
 */
import { useRoutes } from 'react-router-dom';
import styled from 'styled-components';
import { usePermissions } from '@ecnft/wl-user-react';
import { useCallback, useEffect } from 'react';
import { CutomRouteObject, RoutePermission, routes } from '../../route/routes';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import useU3Extension from '../../hooks/useU3Extension';
import {
  selectWebsite,
  setU3ExtensionInstalled,
} from '../../features/website/websiteSlice';
import EventCompleteGuideModal from '../event/EventCompleteGuideModal';
import useRoute from '../../route/useRoute';
import useLogin from '../../hooks/useLogin';

function Main() {
  const dispatch = useAppDispatch();
  const { isLogin, login } = useLogin();
  const { isAdmin } = usePermissions();
  const { openEventCompleteGuideModal, eventCompleteGuideEndCallback } =
    useAppSelector(selectWebsite);
  const { u3ExtensionInstalled } = useU3Extension();
  useEffect(() => {
    dispatch(setU3ExtensionInstalled(u3ExtensionInstalled));
  }, [u3ExtensionInstalled]);

  const { lastRouteMeta } = useRoute();
  useEffect(() => {
    const { permissions } = lastRouteMeta;
    if (
      permissions &&
      permissions.includes(RoutePermission.login) &&
      !isLogin
    ) {
      login();
    }
  }, [lastRouteMeta, isLogin]);

  const renderElement = useCallback(
    ({ element, permissions }: CutomRouteObject) => {
      if (permissions) {
        // 需要以登录为前提的权限
        if (isLogin) {
          // 验证admin权限
          if (permissions.includes(RoutePermission.admin)) {
            if (isAdmin) {
              return element;
            }
            return <NoPermission>Need Admin Permission</NoPermission>;
          }
          return element;
        }
        // 没有登录但需要登录权限
        if (permissions.includes(RoutePermission.login)) {
          return <NoPermission>Need Login</NoPermission>;
        }
      }
      return element;
    },
    [isLogin, isAdmin]
  );
  const routesMap = routes.map((item) => ({
    ...item,
    element: renderElement(item),
  }));
  const renderRoutes = useRoutes(routesMap);
  return (
    <MainWrapper>
      {renderRoutes}
      <EventCompleteGuideModal
        isOpen={openEventCompleteGuideModal}
        onGuideEnd={eventCompleteGuideEndCallback}
      />
    </MainWrapper>
  );
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
