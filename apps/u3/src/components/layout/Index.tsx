/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-04 15:25:04
 * @Description: 站点布局入口
 */
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { MEDIA_BREAK_POINTS } from '../../constants/index';
import Main from './Main';
import { useGAPageView } from '../../hooks/useGoogleAnalytics';
import Menu from './menu';

function Layout() {
  useGAPageView();
  return (
    <LayoutWrapper id="layout-wrapper">
      <Menu />
      <RightBox>
        <RightInner>
          <Main />
        </RightInner>
      </RightBox>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </LayoutWrapper>
  );
}
export default Layout;
const LayoutWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #14171a;
`;
const RightBox = styled.div`
  margin-left: 60px;
  height: 100%;
  width: calc(100% - 60px);
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
`;
const RightInner = styled.div`
  height: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  @media (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: 100%;
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc(${MEDIA_BREAK_POINTS.xxxl}px - 60px);
  }
`;

export const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  @media (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    width: ${MEDIA_BREAK_POINTS.xl}px;
    overflow-x: auto;
  }
`;
