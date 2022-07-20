/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-21 10:42:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-28 14:19:04
 * @FilePath: \synft-app\src\components\Main.tsx
 * @Description: 主要内容呈现组件，路由窗口
 */
import React, { useEffect } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import About from '../container/About';
import Launchpad from '../container/Launchpad';
import MyEnchaNFT from '../container/MyEnchaNFT';
import Info from '../container/Info';
import { backToTop } from '../utils/tools';

const Main: React.FC = () => {
  const location = useLocation();
  const routes = useRoutes([
    { path: '/', element: <About /> },
    { path: '/launchpad', element: <Launchpad /> },
    { path: '/myenchanft', element: <MyEnchaNFT /> },
    { path: '/info/:mint', element: <Info /> },
    { path: '*', element: <div>404</div> },
  ]);
  useEffect(() => {
    backToTop();
  }, [location]);
  return <MainWrapper>{routes}</MainWrapper>;
};
export default Main;
const MainWrapper = styled.div``;
