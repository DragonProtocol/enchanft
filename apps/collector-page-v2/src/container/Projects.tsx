/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-06 14:18:58
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import ScrollBox from '../components/common/box/ScrollBox';
import Loading from '../components/common/loading/Loading';
import useProjectHandles from '../hooks/useProjectHandles';
import ProjectDetailView from '../components/project/ProjectDetailView';
import useEventHandles from '../hooks/useEventHandles';
import useContentHandles from '../hooks/useContentHandles';
import { ContentListItem } from '../services/types/contents';
import NoResult from '../components/common/NoResult';
import FeedsMenu from '../components/layout/FeedsMenu';

export default function Projects() {
  const { id } = useParams();
  const {
    completedIds: eventCompletedIds,
    completeQueueIds: eventCompleteQueueIds,
    onComplete: onEventComplete,
  } = useEventHandles();
  const { onVote, formatCurrentContents } = useContentHandles();
  const { favoredIds, favorQueueIds, onFavor, onShare } = useProjectHandles();
  const { status, moreStatus, noMore } = useAppSelector(selectState);
  const dispatch = useAppDispatch();
  const projectExploreList = useAppSelector(selectAll);

  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const [filter, setFilter] = useState<ProjectExploreListFilterValues>(
    defaultProjectExploreListFilterValues
  );
  const [project, setProject] = useState<ProjectExploreListItemResponse | null>(
    null
  );
  const showProject = useMemo(
    () =>
      project
        ? {
            ...project,
            contents: formatCurrentContents(
              project.contents as ContentListItem[]
            ),
          }
        : null,
    [project, formatCurrentContents]
  );
  useEffect(() => {
    const params = { ...filter };
    if (id) {
      Object.assign(params, {
        projectId: Number(id),
      });
    }
    dispatch(fetchProjectExploreList({ ...params }));
  }, [id, filter]);

  const isInitActive = useRef(false);
  useEffect(() => {
    if (!isInitActive.current && status === AsyncRequestStatus.FULFILLED) {
      if (id) {
        setProject(projectExploreList.find((item) => item.id === Number(id)));
      } else {
        setProject(projectExploreList[0]);
      }
      isInitActive.current = true;
    }
  }, [id, projectExploreList, status]);

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
      <FeedsMenu />
      <ProjectExploreListFilter
        values={filter}
        onChange={(newFilter) => setFilter(newFilter)}
      />
      <MainBox>
        {isLoading ? (
          <Loading />
        ) : (
          <MainBody>
            {!isEmpty ? (
              <>
                <ListBox onScrollBottom={getMore}>
                  <ProjectExploreList
                    data={projectExploreList}
                    activeId={project?.id || 0}
                    favoredIds={favoredIds}
                    favorQueueIds={favorQueueIds}
                    onFavor={onFavor}
                    onShare={onShare}
                    onItemClick={setProject}
                  />
                  {isLoadingMore ? (
                    <MoreLoading>loading ...</MoreLoading>
                  ) : noMore ? (
                    <MoreLoading>No other projects</MoreLoading>
                  ) : null}
                </ListBox>
                <ContentBox>
                  {showProject && (
                    <ProjectDetailView
                      data={showProject}
                      eventCompletedIds={eventCompletedIds}
                      eventCompleteQueueIds={eventCompleteQueueIds}
                      onEventComplete={onEventComplete}
                      onContentVote={onVote}
                    />
                  )}
                </ContentBox>
              </>
            ) : (
              <NoResult />
            )}
          </MainBody>
        )}
      </MainBox>
    </ProjectsWrapper>
  );
}
const ProjectsWrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 24px;
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
