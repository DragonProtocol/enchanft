/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 16:53:17
 * @Description: 首页任务看板
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ListRouteLayout from '../components/layout/ListRoutelLayout';
import ProjectExploreList from '../components/project/ProjectExploreList';
import ProjectExploreListFilter, {
  defaultProjectExploreListFilterValues,
  ProjectExploreListFilterValues,
} from '../components/project/ProjectExploreListFilter';
import {
  fetchProjectExploreList,
  selectAll,
  selectState,
} from '../features/project/projectExploreList';
import { AsyncRequestStatus } from '../services/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function Projects() {
  const navigate = useNavigate();
  const params = useParams();
  const activeId = Number(params.id);
  const { status } = useAppSelector(selectState);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<ProjectExploreListFilterValues>(
    defaultProjectExploreListFilterValues
  );
  useEffect(() => {
    dispatch(fetchProjectExploreList(filter));
  }, [filter]);

  const projectExploreList = useAppSelector(selectAll);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  return (
    <ProjectsWrapper>
      <ProjectExploreListFilter
        values={filter}
        onChange={(newFilter) => setFilter(newFilter)}
      />
      <ProjectsContentBox>
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
      </ProjectsContentBox>
    </ProjectsWrapper>
  );
}
const ProjectsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ProjectsContentBox = styled.div`
  width: 100%;
  flex: 1;
`;
