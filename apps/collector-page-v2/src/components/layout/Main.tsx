/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 20:53:51
 * @Description: 站点主体内容（路由导航）
 */
import { useRoutes } from 'react-router-dom';
import styled from 'styled-components';
import { useWlUserReact } from '@ecnft/wl-user-react';
import { permissionRouteKeys, routes } from '../../route/routes';

function Main() {
  const { isLogin } = useWlUserReact();
  const routesMap = routes.map((item) => ({
    ...item,
    element:
      permissionRouteKeys.includes(item.key) && !isLogin ? (
        <NoLogin>Need Login</NoLogin>
      ) : (
        item.element
      ),
  }));
  const renderRoutes = useRoutes(routesMap);
  return <MainWrapper>{renderRoutes}</MainWrapper>;
}
export default Main;
const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
const NoLogin = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`;
