/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-27 15:23:51
 * @Description: 首页任务看板
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { AsyncRequestStatus } from '../types'
import { SearchTaskStatus, TodoTaskItem } from '../types/api'
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
import ExploreTaskSwiper, { ExplorTaskSwiperItemsType } from '../components/business/task/ExploreTaskSwiper'
import ExploreTaskList, { ExploreTaskListItemsType } from '../components/business/task/ExploreTaskList'
import ExploreTaskFilter, { ExploreTaskFilterDataType } from '../components/business/task/ExploreTaskFilter'
import CardBox from '../components/common/card/CardBox'
import { MEDIA_BREAK_POINTS, MOBILE_BREAK_POINT } from '../constants'
import { selectAll as selectAllForTodoTasks } from '../features/user/todoTasksSlice'

const formatStoreDataToComponentDataByRecommendTasks = (
  tasks: ExploreRecommendTaskItemEntity[],
): ExplorTaskSwiperItemsType => {
  return tasks.map((task) => {
    // TODO 待确认，这里先用task的whiteListTotalNum代替
    // const winnerNum = task.whitelistTotalNum
    return {
      data: { ...task },
    }
  })
}

const formatStoreDataToComponentDataByTasks = (
  tasks: ExploreSearchTaskItemEntity[],
  todoTasks: TodoTaskItem[],
): ExploreTaskListItemsType => {
  return tasks.map((task) => {
    const findTask = todoTasks.find((item) => item.id === task.id)
    return {
      data: findTask ? { ...task, status: findTask.status } : task,
    }
  })
}
const Events: React.FC = () => {
  const dispatch = useAppDispatch()
  const todoTasks = useAppSelector(selectAllForTodoTasks)
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
    status: SearchTaskStatus.ALL,
    keywords: '',
  })
  useEffect(() => {
    dispatch(
      fetchExploreSearchTasks({
        status: searchTasksFilter.status,
        keywords: searchTasksFilter.keywords,
      }),
    )
  }, [searchTasksFilter])

  // 展示数据
  const recommendTaskItems = formatStoreDataToComponentDataByRecommendTasks(recommendTasks)
  const recommendTasksLoading = recommendTasksStatus === AsyncRequestStatus.PENDING ? true : false
  const searchTaskItems = formatStoreDataToComponentDataByTasks(tasks, todoTasks)
  const searchTasksLoading = searchTasksStatus === AsyncRequestStatus.PENDING ? true : false

  return (
    <EventsWrapper>
      {recommendTaskItems.length > 0 && (
        <RecommendTasksBox>
          <ExploreTaskSwiper items={recommendTaskItems} />
        </RecommendTasksBox>
      )}

      <SearchTasksBox>
        <ExploreTaskFilter data={searchTasksFilter} onChange={setTasksFilter} />
        <ExploreTaskList items={searchTaskItems} loading={searchTasksLoading} />
      </SearchTasksBox>
    </EventsWrapper>
  )
}
export default Events
const EventsWrapper = styled.div`
  width: 100%;
`
const RecommendTasksBox = styled.div`
  height: 308px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    height: 458px;
  }
`
const SearchTasksBox = styled(CardBox)`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
