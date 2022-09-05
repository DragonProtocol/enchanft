import { Outlet, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { useAppConfig } from '../AppProvider';
import AsideNav from './AsideNav';

export default function MainLayout() {
  const { phantomValid, metaMaskValid } = useAppConfig();
  return (
    <MainLayoutBox>
      <AsideNav></AsideNav>
      <main id="main">
        <Outlet />
      </main>
    </MainLayoutBox>
  );
}

const MainLayoutBox = styled.div`
  display: flex;
  margin-top: 1px;
  height: calc(100vh - 73px);
  overflow: hidden;

  & aside {
    overflow: scroll;
  }
  & main {
    flex-grow: 1;
    overflow: scroll;

    & > div {
      margin: 20px auto;
      box-sizing: border-box;
      max-width: 1208px;
      background: #f7f9f1;
      border: 4px solid #333333;
      border-radius: 20px;
    }
  }
`;
