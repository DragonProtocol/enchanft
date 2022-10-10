/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 15:58:37
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-09 11:47:56
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
import ExploreProjectSwiper, { ExplorProjectSwiperItemsType } from '../components/business/project/ExploreProjectSwiper'
import ExploreProjectIndexList, {
  ExploreProjectIndexListItemsType,
} from '../components/business/project/ExploreProjectIndexList'
import ExploreProjectIndexFilter, {
  ExploreProjectIndexFilterDataType,
  MintStageOther,
} from '../components/business/project/ExploreProjectIndexFilter'
import CardBox from '../components/common/card/CardBox'
import { MOBILE_BREAK_POINT } from '../constants'

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
): ExploreProjectIndexListItemsType => {
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
  const [searchProjectsFilter, setProjectsFilter] = useState<ExploreProjectIndexFilterDataType>({
    mintStage: MintStageOther.All,
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
      {recommendProjectItems.length > 0 && (
        <RecommendProjectsBox>
          <ExploreProjectSwiper items={recommendProjectItems} />
        </RecommendProjectsBox>
      )}

      <SearchProjectsBox>
        <ExploreProjectIndexFilter data={searchProjectsFilter} onChange={setProjectsFilter} />
        <ExploreProjectIndexList items={searchProjectItems} loading={searchProjectsLoading} />
      </SearchProjectsBox>
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
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    height: 528px;
  }
`
const SearchProjectsBox = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`
