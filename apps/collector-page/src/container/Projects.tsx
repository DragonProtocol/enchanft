/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 15:58:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-10 13:12:55
 * @Description: file description
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { AsyncRequestStatus } from '../types'
import {
  ExploreRecommendProjectItemEntity,
  fetchExploreRecommendProjects,
  selectExploreRecommendProjectsState,
  selectAll as selectAllForExploreRecommendProjects,
} from '../features/explore/recommendProjectsSlice'
import {
  ExploreSearchProjectItemEntity,
  fetchExploreSearchProjects,
  selectExploreSearchProjectsState,
  selectAll as selectAllForExploreSearchProjects,
} from '../features/explore/searchProjectsSlice'
import ScrollBox from '../components/common/ScrollBox'
import MainContentBox from '../components/layout/MainContentBox'
import ExploreProjectSwiper, { ExplorProjectSwiperItemsType } from '../components/business/project/ExploreProjectSwiper'
import ExploreProjectList, { ExploreProjectListItemsType } from '../components/business/project/ExploreProjectList'
import ExploreProjectFilter, {
  ExploreProjectFilterDataType,
  ProjectStatusOther,
} from '../components/business/project/ExploreProjectFilter'
import CardBox from '../components/common/card/CardBox'

const formatStoreDataToComponentDataByRecommendProjects = (
  projects: ExploreRecommendProjectItemEntity[],
): ExplorProjectSwiperItemsType => {
  return projects.map((project) => {
    return {
      data: project,
    }
  })
}

const formatStoreDataToComponentDataByProjects = (
  projects: ExploreSearchProjectItemEntity[],
): ExploreProjectListItemsType => {
  return projects.map((project) => {
    return {
      data: project,
    }
  })
}
const Projects: React.FC = () => {
  const dispatch = useAppDispatch()
  // recommend projects
  const { status: recommendProjectsStatus } = useAppSelector(selectExploreRecommendProjectsState)
  const recommendProjects = useAppSelector(selectAllForExploreRecommendProjects)
  useEffect(() => {
    dispatch(fetchExploreRecommendProjects())
  }, [])

  // search projects
  const { status: searchProjectsStatus } = useAppSelector(selectExploreSearchProjectsState)
  const projects = useAppSelector(selectAllForExploreSearchProjects)
  const [searchProjectsFilter, setProjectsFilter] = useState<ExploreProjectFilterDataType>({
    status: ProjectStatusOther.All,
    keywords: '',
  })
  useEffect(() => {
    dispatch(fetchExploreSearchProjects(searchProjectsFilter))
  }, [searchProjectsFilter])

  // 展示数据
  const recommendProjectItems = formatStoreDataToComponentDataByRecommendProjects(recommendProjects)
  const recommendProjectsLoading = recommendProjectsStatus === AsyncRequestStatus.PENDING ? true : false
  const searchProjectItems = formatStoreDataToComponentDataByProjects(projects)
  const searchProjectsLoading = searchProjectsStatus === AsyncRequestStatus.PENDING ? true : false

  return (
    <ProjectsWrapper>
      <MainContentBox>
        <RecommendProjectsBox>
          <ExploreProjectSwiper items={recommendProjectItems} loading={recommendProjectsLoading} />
        </RecommendProjectsBox>
        <SearchProjectsBox>
          <ExploreProjectFilter data={searchProjectsFilter} onChange={setProjectsFilter} />
          <ExploreProjectList items={searchProjectItems} loading={searchProjectsLoading} />
        </SearchProjectsBox>
      </MainContentBox>
    </ProjectsWrapper>
  )
}
export default Projects
const ProjectsWrapper = styled.div`
  width: 100%;
  height: 100%;
`
const RecommendProjectsBox = styled.div`
  height: 368px;
`
const SearchProjectsBox = styled(CardBox)`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
