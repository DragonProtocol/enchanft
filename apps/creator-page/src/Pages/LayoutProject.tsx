import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAppConfig } from '../AppProvider';
import AsideNav from '../Components/AsideNav';
import Loading from '../Components/Loading';
import { fetchProjectDetail, selectProjectDetail } from '../redux/projectSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

export default function MainLayout() {
  const { slug } = useParams();
  const { account } = useAppConfig();
  const dispatch = useAppDispatch();
  const { data: project } = useAppSelector(selectProjectDetail);

  useEffect(() => {
    if (!slug || !account.info?.token) return;
    dispatch(fetchProjectDetail({ slug, token: account.info.token }));
  }, [account, dispatch, slug]);

  // log.debug(slug, project);
  if (!project) {
    return (
      <LoadingBox>
        <Loading />
      </LoadingBox>
    );
  }
  return (
    <MainLayoutBox>
      <AsideNav project={project} />
      <main id="main">
        <Outlet />
      </main>
    </MainLayoutBox>
  );
}

const LoadingBox = styled.div`
  text-align: center;
  padding-top: 100px;
  & img {
    width: 100px;
  }
`;

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
      border-radius: 20px;
    }
  }
`;
