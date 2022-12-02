/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-02 19:30:28
 * @Description: 首页任务看板
 */
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ListRouteLayout from '../components/layout/ListRoutelLayout';
import ProjectExploreList from '../components/project/ProjectExploreList';
import {
  fetchProjectExploreList,
  selectAll,
  selectState,
} from '../features/project/projectExploreList';
import { RouteKey } from '../route/routes';
import useRoute from '../route/useRoute';
import { AsyncRequestStatus } from '../services/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function Projects() {
  const navigate = useNavigate();
  const { lastRouteMeta } = useRoute();
  const params = useParams();
  const activeId = Number(params.id);
  const { status } = useAppSelector(selectState);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProjectExploreList({}));
  }, []);

  const projectExploreList = useAppSelector(selectAll);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  return (
    <ProjectsWrapper>
      {isLoading ? (
        <span>loading</span>
      ) : (
        <ListRouteLayout>
          <ProjectExploreList
            data={projectExploreList}
            activeId={activeId}
            onItemClick={(item) => navigate(`/projects/${item.id}`)}
          />
        </ListRouteLayout>
      )}
    </ProjectsWrapper>
  );
}
const ProjectsWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
