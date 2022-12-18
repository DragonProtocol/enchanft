/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 16:13:39
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
import { ScrollBarCss } from '../../GlobalStyle';

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
        <LeftBox>
          <LeftInner>
            <Nav />
          </LeftInner>
        </LeftBox>

        <RightBox>
          <RightInner>
            <MainPageBox>
              <Main />
            </MainPageBox>
          </RightInner>
        </RightBox>
      </ContentBox>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #14171a;
`;
const HeaderBox = styled.div`
  width: 100%;
  background: #1b1e23;
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
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: ${MEDIA_BREAK_POINTS.xxxl}px;
    margin: 0 auto;
  }
`;
const ContentBox = styled.div`
  width: 100%;
  height: calc(100vh - 72px);
  margin-top: 72px;
  display: flex;
`;
const LeftBox = styled.div`
  background: #1b1e23;
  @media (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: 200px;
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    background: none;
    width: calc((100vw - ${MEDIA_BREAK_POINTS.xxxl}px) / 2 + 200px);
    display: flex;
    justify-content: flex-end;
  }
`;
const LeftInner = styled.div`
  width: 200px;
  padding: 20px;
  box-sizing: border-box;
`;
const RightBox = styled.div`
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    flex: 1;
  }
  @media (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc(100vw - (100vw - ${MEDIA_BREAK_POINTS.xxxl}px) / 2 - 200px);
    display: flex;
    justify-content: flex-start;
  }
`;
const RightInner = styled.div`
  width: calc(100vw - (100vw - ${MEDIA_BREAK_POINTS.xxxl}px) / 2 - 200px);
`;
const MainPageBox = styled.div`
  height: 100%;
  box-sizing: border-box;
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: 100%;
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc(${MEDIA_BREAK_POINTS.xxxl}px - 200px);
  }
`;

export const MainWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 72px);
  padding: 24px 40px;
  box-sizing: border-box;
`;
