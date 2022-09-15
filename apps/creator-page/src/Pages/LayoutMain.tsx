import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useAppConfig } from '../AppProvider';
import CreatorNeed from '../Components/RoleNeed';

export default function ProjectLayout() {
  const { isCreator } = useAppConfig();
  if (!isCreator) return <CreatorNeed content="Must Be Creator" />;
  return (
    <MainBox id="main">
      <Outlet />
    </MainBox>
  );
}

const MainBox = styled.main`
  height: calc(100vh - 73px);
  margin-top: 1px;
  overflow: scroll;
  > div {
    margin: 20px auto;
    box-sizing: border-box;
    max-width: 1208px;
    border-radius: 20px;
  }
`;
