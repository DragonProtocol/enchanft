/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-08 17:11:41
 * @Description: 首页任务看板
 */
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
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
import { ProjectExploreListItemResponse } from '../services/types/project';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Project from './Project';

export default function Projects() {
  const params = useParams();
  const activeId = Number(params.id);
  const { status } = useAppSelector(selectState);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<ProjectExploreListFilterValues>(
    defaultProjectExploreListFilterValues
  );
  const [project, setProject] =
    useState<Maybe<ProjectExploreListItemResponse>>(null);
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
      <MainBox>
        <ListBox>
          {isLoading ? (
            <span>loading</span>
          ) : (
            <ProjectExploreList
              data={projectExploreList}
              activeId={activeId}
              onItemClick={setProject}
            />
          )}
        </ListBox>
        <ContentBox>{project && <Project data={project} />}</ContentBox>
      </MainBox>
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
const MainBox = styled.div`
  width: 100%;
  height: 0px;
  flex: 1;
  display: flex;
  gap: 20px;
`;
const ListBox = styled.div`
  width: 400px;
  border-radius: 10px;
  background-color: rgba(41, 41, 41, 1);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;
const ContentBox = styled.div`
  width: 0;
  flex: 1;
  overflow-y: auto;
`;
