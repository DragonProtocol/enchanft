import React from 'react'
import styled from 'styled-components'
import Main from './Main'
import Header from './Header'
const Layout: React.FC = () => {
  return (
    <LayoutWrapper>
      <div className="header">
        <div className="layout-inner header-inner">
          <Header></Header>
        </div>
      </div>
      <div className="main">
        <div className="main-route">
          <div className="layout-inner">
            <Main></Main>
          </div>
        </div>
        <div className="main-footer">
          <div className="layout-inner footer-inner">
            <div className="line"></div>
            <div className="copyright">Composable NFTs, Endless Possibilities</div>
          </div>
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
    .header-inner {
      height: 100%;
    }
  }
  .main {
    height: calc(100vh - 72px);
    overflow: overlay;
    .main-route {
      padding:24px 0;
      box-sizing: border-box;
      min-height: calc(100vh - 72px - 60px - 35px);
    }
    .main-footer {
      height: 60px;
      margin-bottom: 35px;
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
        }
      }
    }
  }
`
