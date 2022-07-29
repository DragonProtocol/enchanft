/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-29 10:46:58
 * @Description: 首页任务看板
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { AsyncRequestStatus } from '../types'
import { ExploreTaskSortBy } from '../types/api'
import {
  ExploreRecommendTaskItemEntity,
  fetchExploreRecommendTasks,
  selectExploreRecommendTasksState,
  selectAll as selectAllForExploreRecommendTasks,
} from '../features/explore/recommendTasksSlice'
import {
  ExploreSearchTaskItemEntity,
  fetchExploreSearchTasks,
  selectExploreSearchTasksState,
  selectAll as selectAllForExploreSearchTasks,
} from '../features/explore/searchTasksSlice'
import ScrollBox from '../components/common/ScrollBox'
import MainContentBox from '../components/layout/MainContentBox'
import ExploreTaskSwiper, { ExplorTaskSwiperItemsType } from '../components/business/task/ExploreTaskSwiper'
import ExploreTaskList, { ExploreTaskListItemsType } from '../components/business/task/ExploreTaskList'
import ExploreTaskFilter, { ExploreTaskFilterDataType } from '../components/business/task/ExploreTaskFilter'
import CardBox from '../components/common/card/CardBox'

const formatStoreDataToComponentDataByRecommendTasks = (
  tasks: ExploreRecommendTaskItemEntity[],
): ExplorTaskSwiperItemsType => {
  return tasks.map((task) => {
    // TODO 待确认，这里先用task的whiteListTotalNum代替
    // const winnersNum = task.whitelistTotalNum
    return {
      data: { ...task },
    }
  })
}

const formatStoreDataToComponentDataByTasks = (tasks: ExploreSearchTaskItemEntity[]): ExploreTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: task,
    }
  })
}
const Events: React.FC = () => {
  const dispatch = useAppDispatch()
  // recommend tasks
  const { status: recommendTasksStatus } = useAppSelector(selectExploreRecommendTasksState)
  const recommendTasks = useAppSelector(selectAllForExploreRecommendTasks)
  useEffect(() => {
    dispatch(fetchExploreRecommendTasks())
  }, [])

  // search tasks
  const { status: searchTasksStatus } = useAppSelector(selectExploreSearchTasksState)
  const tasks = useAppSelector(selectAllForExploreSearchTasks)
  const [searchTasksFilter, setTasksFilter] = useState<ExploreTaskFilterDataType>({
    sortBy: ExploreTaskSortBy.NEW,
    keywords: '',
  })
  useEffect(() => {
    dispatch(
      fetchExploreSearchTasks({
        orderType: searchTasksFilter.sortBy,
        keywords: searchTasksFilter.keywords,
      }),
    )
  }, [searchTasksFilter])

  // 展示数据
  const recommendTaskItems = formatStoreDataToComponentDataByRecommendTasks(recommendTasks)
  const recommendTasksLoading = recommendTasksStatus === AsyncRequestStatus.PENDING ? true : false
  const searchTaskItems = formatStoreDataToComponentDataByTasks(tasks)
  const searchTasksLoading = searchTasksStatus === AsyncRequestStatus.PENDING ? true : false

  return (
    <EventsWrapper>
      <MainContentBox>
        <RecommendTasksBox>
          <ExploreTaskSwiper items={recommendTaskItems} loading={recommendTasksLoading} />
        </RecommendTasksBox>
        <SearchTasksBox>
          <ExploreTaskFilter data={searchTasksFilter} onChange={setTasksFilter} />
          <ExploreTaskList items={searchTaskItems} loading={searchTasksLoading} />
        </SearchTasksBox>
      </MainContentBox>
    </EventsWrapper>
  )
}
export default Events
const EventsWrapper = styled.div`
  width: 100%;
`
const RecommendTasksBox = styled.div`
  margin-bottom: 100px;
`
const SearchTasksBox = styled(CardBox)`
  display: flex;
  flex-direction: column;
  gap: 40px;
`
