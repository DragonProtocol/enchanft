/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 11:46:30
 * @Description: 首页任务看板
 */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { AsyncRequestStatus } from '../types';
import { SearchTaskStatus } from '../types/api';
import {
  ExploreRecommendTaskItemEntity,
  fetchExploreRecommendTasks,
  selectExploreRecommendTasksState,
  selectAll as selectAllForExploreRecommendTasks,
} from '../features/explore/recommendTasksSlice';
import {
  ExploreSearchTaskItemEntity,
  fetchExploreSearchTasks,
  selectExploreSearchTasksState,
  selectAll as selectAllForExploreSearchTasks,
} from '../features/explore/searchTasksSlice';
import ExploreTaskSwiper, {
  ExplorTaskSwiperItemsType,
} from '../components/business/task/ExploreTaskSwiper';
import ExploreTaskList, {
  ExploreTaskListItemsType,
} from '../components/business/task/ExploreTaskList';
import ExploreTaskFilter, {
  ExploreTaskFilterDataType,
} from '../components/business/task/ExploreTaskFilter';
import CardBox from '../components/common/card/CardBox';
import { MEDIA_BREAK_POINTS, MOBILE_BREAK_POINT } from '../constants';
import { ButtonInfo } from '../components/common/button/ButtonBase';
import {
  fetchExploreSearchProjects,
  selectExploreSearchProjectsState,
  selectAll as selectAllForExploreSearchProjects,
  ExploreSearchProjectItemEntity,
} from '../features/explore/searchProjectsSlice';
import { MintStageOther } from '../components/business/project/ExploreProjectIndexFilter';
import ExploreProjectList, {
  ExploreProjectListItemsType,
} from '../components/business/project/ExploreProjectList';

const formatStoreDataToComponentDataByRecommendTasks = (
  tasks: ExploreRecommendTaskItemEntity[]
): ExplorTaskSwiperItemsType => {
  return tasks.map((task) => {
    // TODO 待确认，这里先用task的whiteListTotalNum代替
    // const winnerNum = task.whitelistTotalNum
    return {
      data: { ...task },
    };
  });
};

const formatStoreDataToComponentDataByTasks = (
  tasks: ExploreSearchTaskItemEntity[]
): ExploreTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: task,
    };
  });
};
const formatStoreDataToComponentDataByProjects = (
  projects: ExploreSearchProjectItemEntity[]
): ExploreProjectListItemsType => {
  return projects.map((project) => {
    return {
      data: project,
    };
  });
};
const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // recommend tasks
  const { status: recommendTasksStatus } = useAppSelector(
    selectExploreRecommendTasksState
  );
  const recommendTasks = useAppSelector(selectAllForExploreRecommendTasks);
  useEffect(() => {
    dispatch(fetchExploreRecommendTasks());
  }, []);

  // search tasks
  const { status: searchTasksStatus } = useAppSelector(
    selectExploreSearchTasksState
  );
  const tasks = useAppSelector(selectAllForExploreSearchTasks);
  // search projects
  const { status: searchProjectsStatus } = useAppSelector(
    selectExploreSearchProjectsState
  );
  const projects = useAppSelector(selectAllForExploreSearchProjects);
  useEffect(() => {
    dispatch(
      fetchExploreSearchTasks({
        status: SearchTaskStatus.ALL,
      })
    );
    dispatch(
      fetchExploreSearchProjects({
        mintStage: MintStageOther.All,
      })
    );
  }, []);

  // 展示数据
  const recommendTaskItems =
    formatStoreDataToComponentDataByRecommendTasks(recommendTasks);
  const recommendTasksLoading =
    recommendTasksStatus === AsyncRequestStatus.PENDING;
  const searchTaskItems = formatStoreDataToComponentDataByTasks(tasks).slice(
    0,
    4
  );
  const searchTasksLoading = searchTasksStatus === AsyncRequestStatus.PENDING;
  const searchProjectItems = formatStoreDataToComponentDataByProjects(
    projects
  ).slice(0, 4);
  const searchProjectsLoading =
    searchProjectsStatus === AsyncRequestStatus.PENDING;
  return (
    <HomeWrapper>
      {recommendTaskItems.length > 0 && (
        <RecommendTasksBox>
          <ExploreTaskSwiper items={recommendTaskItems} />
        </RecommendTasksBox>
      )}

      <HomeCard>
        <CardHeader>
          <CardTitle>events</CardTitle>
          <CardNavigateBtn onClick={() => navigate('/events')}>
            View All {'>>'}
          </CardNavigateBtn>
        </CardHeader>
        <ExploreTaskList items={searchTaskItems} loading={searchTasksLoading} />
      </HomeCard>
      <HomeCard>
        <CardHeader>
          <CardTitle>projects</CardTitle>
          <CardNavigateBtn onClick={() => navigate('/projects')}>
            View All {'>>'}
          </CardNavigateBtn>
        </CardHeader>
        <ExploreProjectList
          items={searchProjectItems}
          loading={searchProjectsLoading}
        />
      </HomeCard>
    </HomeWrapper>
  );
};
export default Home;
const HomeWrapper = styled.div`
  width: 100%;
`;
const RecommendTasksBox = styled.div`
  height: 308px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    height: 458px;
  }
`;
const HomeCard = styled(CardBox)`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CardTitle = styled.span`
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;
  color: #333333;
  text-transform: uppercase;
`;
const CardNavigateBtn = styled(ButtonInfo)`
  height: 40px;
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`;
