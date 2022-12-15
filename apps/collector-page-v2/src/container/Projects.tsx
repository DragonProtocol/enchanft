/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-15 14:12:11
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MainWrapper } from '../components/layout/Index';
import ListScrollBox from '../components/common/box/ListScrollBox';
import ProjectExploreList from '../components/project/ProjectExploreList';
import ProjectExploreListFilter, {
  defaultProjectExploreListFilterValues,
  ProjectExploreListFilterValues,
} from '../components/project/ProjectExploreListFilter';
import {
  fetchMoreProjectExploreList,
  fetchProjectExploreList,
  selectAll,
  selectState,
} from '../features/project/projectExploreList';
import { AsyncRequestStatus } from '../services/types';
import { ProjectExploreListItemResponse } from '../services/types/project';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Project from './Project';
import ScrollBox from '../components/common/box/ScrollBox';
import Loading from '../components/common/loading/Loading';

export default function Projects() {
  const params = useParams();
  const { status, moreStatus } = useAppSelector(selectState);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<ProjectExploreListFilterValues>(
    defaultProjectExploreListFilterValues
  );
  const [project, setProject] = useState<ProjectExploreListItemResponse | null>(
    null
  );
  useEffect(() => {
    dispatch(fetchProjectExploreList(filter));
  }, [filter]);

  const projectExploreList = useAppSelector(selectAll);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const getMore = useCallback(
    () => dispatch(fetchMoreProjectExploreList(filter)),
    [filter]
  );
  const isLoadingMore = useMemo(
    () => moreStatus === AsyncRequestStatus.PENDING,
    [moreStatus]
  );
  const isEmpty = useMemo(
    () => !projectExploreList.length,
    [projectExploreList]
  );
  return (
    <ProjectsWrapper>
      <ProjectExploreListFilter
        values={filter}
        onChange={(newFilter) => setFilter(newFilter)}
      />
      <MainBox>
        {isLoading ? (
          <Loading />
        ) : (
          !isEmpty && (
            <MainBody>
              <ListBox onScrollBottom={getMore}>
                <ProjectExploreList
                  data={projectExploreList}
                  activeId={project?.id || 0}
                  onItemClick={setProject}
                />
                {isLoadingMore && <MoreLoading>loading ...</MoreLoading>}
              </ListBox>
              <ContentBox>{project && <Project data={project} />}</ContentBox>
            </MainBody>
          )
        )}
      </MainBox>
    </ProjectsWrapper>
  );
}
const ProjectsWrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const MainBox = styled.div`
  width: 100%;
  height: 0px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const MainBody = styled.div`
  width: 100%;
  height: 100%;
  background: #1b1e23;
  border: 1px solid #39424c;
  box-sizing: border-box;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
`;
const ListBox = styled(ListScrollBox)`
  width: 360px;
  height: 100%;
  border-right: 1px solid #39424c;
  box-sizing: border-box;
  overflow-y: auto;
`;
const MoreLoading = styled.div`
  padding: 20px;
  text-align: center;
  color: #748094;
`;
const ContentBox = styled(ScrollBox)`
  width: 0;
  flex: 1;
  padding: 20px;
`;
