/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 20:03:01
 * @Description: 站点布局入口
 */
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { MEDIA_BREAK_POINTS, MOBILE_BREAK_POINT } from '../../constants/index';
import Main from './Main';
import Header from './Header';
import { useGAPageView } from '../../hooks/useGoogleAnalytics';
import Nav from './Nav';

function Layout() {
  useGAPageView();
  return (
    <LayoutWrapper id="layout-wrapper">
      <HeaderBox>
        <HeaderInner>
          <Header />
        </HeaderInner>
      </HeaderBox>
      <ContentBox>
        <Nav />
        <PageBox>
          <Main />
        </PageBox>
      </ContentBox>
      <ToastContainer autoClose={2000} position="top-right" />
    </LayoutWrapper>
  );
}
export default Layout;
const LayoutWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ebeee4;
`;
const HeaderBox = styled.div`
  width: 100%;
  background: #f7f9f1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
`;
const HeaderInner = styled.div`
  width: 100%;
  height: 72px;
  box-sizing: border-box;
  padding: 0 40px;
  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    margin: 0 auto;
  }
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    padding: 0 20px;
  }
`;
const ContentBox = styled.div`
  width: 100%;
  height: calc(100vh - 72px);
  margin-top: 72px;
  display: flex;
`;
const PageBox = styled.div`
  flex: 1;
  height: 100%;
  box-sizing: border-box;
`;
