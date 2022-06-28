import React from 'react'
import styled from 'styled-components'
import Main from './Main'
import Header from './Header'
import { MEDIA_BREAK_POINTS } from '../utils/constants'
const Layout: React.FC = () => {
  return (
    <LayoutWrapper>
      <div className="header">
        <div className="layout-inner header-inner">
          <Header></Header>
        </div>
      </div>
      <div className="main" id="layoutMainScroll">
        <div className="main-route">
          <div className="layout-inner">
            <Main></Main>
          </div>
        </div>
        <div className="main-footer">
          {/* <div className="layout-inner footer-inner">
            <div className="line"></div>
            <div className="copyright">Composable NFTs, Endless Possibilities</div>
          </div> */}
        </div>
      </div>
    </LayoutWrapper>
  )
}
export default Layout
const LayoutWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  .layout-inner {
    max-width: 1024px;
    margin: 0 auto;
  }
  .header {
    width: 100%;
    height: 72px;
    background: #ffffff;
    box-sizing: border-box;
    @media (max-width: ${MEDIA_BREAK_POINTS.md}px) {
      padding: 0 12px;
    }
    .header-inner {
      height: 100%;
    }
  }
  .main {
    height: calc(100vh - 72px - 48px);
    overflow-y: overlay;
    overflow-x: hidden;
    padding-top: 48px;
    @media (max-width: ${MEDIA_BREAK_POINTS.md}px) {
      padding: 12px;
      padding-bottom: 0;
      height: calc(100vh - 72px - 12px);
    }
    .main-route {
      box-sizing: border-box;
      min-height: calc(100vh - 72px - 48px - 60px - 70px);
    }
    .main-footer {
      height: 60px;
      margin: 35px 0;
      .footer-inner {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .line {
          width: 40px;
          height: 2px;
          background: #222222;
        }
        .copyright {
          @media (max-width: ${MEDIA_BREAK_POINTS.md}px) {
            font-size: 12px;
            text-align: center;
            line-height: 20px;
          }
        }
      }
    }
  }
`
