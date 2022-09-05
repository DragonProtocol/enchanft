import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

export default function ProjectLayout() {
  return (
    <MainBox id="main">
      <Outlet />
    </MainBox>
  );
}

const MainBox = styled.main`
  height: calc(100vh - 72px);
  overflow: scroll;
  > div {
    margin: 20px auto;
    box-sizing: border-box;
    max-width: 1208px;
    background: #f7f9f1;
    border: 4px solid #333333;
    border-radius: 20px;
  }
`;
