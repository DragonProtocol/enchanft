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
        <div className="layout-inner">
          <Main></Main>
        </div>
      </div>
      <div className="footer">
        <div className="layout-inner">
          <div className="line"></div>
          <div className="copyright">Copyright 2022 Dragon By NFT people, for NFT people</div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
export default Layout
const LayoutWrapper = styled.div`
  width: 100%;
  min-height: calc(100% - 72px);
  box-sizing: border-box;
  .layout-inner {
    max-width: 1024px;
    margin: 0 auto;
  }
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    background: #ffffff;
    box-sizing: border-box;
    z-index: 2000;
    .header-inner {
      height: 72px;
    }
  }
  .main {
    margin-top: 72px;
    padding: 24px;
    min-height: calc(100vh - 72px)
  }
  .footer {
    padding-bottom: 35px;
    .line {
      width: 40px;
      height: 2px;
      background: #222222;
      margin: 0 auto;
      margin-bottom: 35px;
    }
    .copyright {
      text-align: center;
    }
  }
`
