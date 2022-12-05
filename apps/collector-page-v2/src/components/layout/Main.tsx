/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-02 18:13:58
 * @Description: 站点主体内容（路由导航）
 */
import { useRoutes } from 'react-router-dom';
import styled from 'styled-components';
import { useWlUserReact } from '@ecnft/wl-user-react';
import { useEffect } from 'react';
import { permissionRouteKeys, routes } from '../../route/routes';
import { useAppDispatch } from '../../store/hooks';
import {
  fetchFavoredEvents,
  removeAll as removeAllForFavoredEvents,
} from '../../features/event/userFavoredEvents';
import {
  fetchCompletedEvents,
  removeAll as removeAllForCompletedEvents,
} from '../../features/event/userCompletedEvents';
import {
  fetchFavoredProjects,
  removeAll as removeAllForFavoredProjects,
} from '../../features/project/userFavoredProjects';

function Main() {
  const dispatch = useAppDispatch();
  const { isLogin } = useWlUserReact();
  // 获取用户相关信息
  useEffect(() => {
    if (!isLogin) {
      dispatch(removeAllForFavoredEvents());
      dispatch(removeAllForCompletedEvents());
      dispatch(removeAllForFavoredProjects());
      return;
    }
    dispatch(fetchFavoredEvents());
    dispatch(fetchCompletedEvents());
    dispatch(fetchFavoredProjects());
  }, [isLogin]);
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
