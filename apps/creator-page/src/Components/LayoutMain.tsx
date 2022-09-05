import { Outlet, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { useAppConfig } from '../AppProvider';
import AsideNav from './AsideNav';

export default function MainLayout() {
  const { phantomValid, metaMaskValid } = useAppConfig();
  return (
    <MainLayoutBox>
      <AsideNav></AsideNav>
      <main>
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
      box-sizing: border-box;
      max-width: 1200px;
      margin: 0 auto;
    }
  }
`;
