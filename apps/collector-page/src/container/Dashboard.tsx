/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-13 12:13:39
 * @Description: 首页任务看板
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import {
  fetchRecommendTasks,
  selectAll as selectAllForRecommendTasks,
  selectRecommendTasksState,
  TaskItemForEntity,
} from '../features/dashboard/recommendTasksSlice'
import {
  fetchProjects,
  ProjectItemForEntity,
  selectAll as selectAllForProjects,
  selectProjectsState,
} from '../features/dashboard/projectsSlice'
import TaskSwiper, { TaskSwiperItemsType } from '../components/business/dashboard/TaskSwiper'
import { selectAccount } from '../features/user/accountSlice'
import ProjectList, { ProjectListItemsType } from '../components/business/dashboard/ProjectList'
import ScrollBox from '../components/common/ScrollBox'
import ProjectFilter, {
  ProjectFilterDataType,
  ProjectStatusOther,
} from '../components/business/dashboard/ProjectFilter'
import MainContentBox from '../components/layout/MainContentBox'
import { TaskAcceptedStatus } from '../types/api'
import { selectUserTaskHandlesState, take, TakeTaskParams, TaskHandle } from '../features/user/taskHandlesSlice'
import { AsyncRequestStatus } from '../types'
const formatStoreDataToComponentDataByRecommendTasks = (
  tasks: TaskItemForEntity[],
  token: string,
  takeTaskState: TaskHandle<TakeTaskParams>,
): TaskSwiperItemsType => {
  return tasks.map((task) => {
    const displayConnectWalletTip = token ? false : true
    const displayAccept = token && task.acceptedStatus === TaskAcceptedStatus.DONE ? true : false
    const displayTake = token && task.acceptedStatus === TaskAcceptedStatus.CANDO ? true : false
    const loadingTake = takeTaskState.params?.id === task.id && takeTaskState.status === AsyncRequestStatus.PENDING
    const disabledTake = !token || loadingTake ? true : false
    return {
      data: task,
      viewConfig: {
        displayConnectWalletTip,
        displayAccept,
        displayTake,
        disabledTake,
        loadingTake,
      },
    }
  })
}

const formatStoreDataToComponentDataByProjects = (projects: ProjectItemForEntity[]): ProjectListItemsType => {
  return projects.map((project) => {
    return {
      data: project,
    }
  })
}
const Dashboard: React.FC = () => {
  const { token } = useAppSelector(selectAccount)
  const dispatch = useAppDispatch()
  // 获取推荐的任务
  const { status: recommendTasksStatus } = useAppSelector(selectRecommendTasksState)
  const recommendTasks = useAppSelector(selectAllForRecommendTasks)
  useEffect(() => {
    dispatch(fetchRecommendTasks())
  }, [token])

  // 获取项目列表
  const { status: projectsStateStatus } = useAppSelector(selectProjectsState)
  const projects = useAppSelector(selectAllForProjects)
  const [projectsFilter, setProjectsFilter] = useState<ProjectFilterDataType>({
    status: ProjectStatusOther.All,
    keywords: '',
  })
  useEffect(() => {
    dispatch(fetchProjects(projectsFilter))
  }, [projectsFilter])

  // 接受任务
  const handleTakeTask = (id) => {
    dispatch(take({ id }))
  }
  // 接任务的状态
  const { take: takeTaskState } = useAppSelector(selectUserTaskHandlesState)

  // 展示数据

  const taskSwiperItems = formatStoreDataToComponentDataByRecommendTasks(recommendTasks, token, takeTaskState)
  const projectListItems = formatStoreDataToComponentDataByProjects(projects)
  const taskSwiperLoading = recommendTasksStatus === AsyncRequestStatus.PENDING ? true : false
  const projectListLoading = projectsStateStatus === AsyncRequestStatus.PENDING ? true : false
  return (
    <DashboardWrapper>
      <ScrollBox>
        <MainContentBox>
          <TaskSwiperBox>
            <TaskSwiper
              items={taskSwiperItems}
              onTake={(task) => handleTakeTask(task.id)}
              loading={taskSwiperLoading}
            />
          </TaskSwiperBox>
          <ProjectFilterBox>
            <ProjectFilter data={projectsFilter} onChange={setProjectsFilter} />
          </ProjectFilterBox>
          <ProjectListBox>
            <ProjectList items={projectListItems} loading={projectListLoading} />
          </ProjectListBox>
        </MainContentBox>
      </ScrollBox>
    </DashboardWrapper>
  )
}
export default Dashboard
const DashboardWrapper = styled.div`
  width: 100%;
  height: 100%;
`
const TaskSwiperBox = styled.div`
  margin-bottom: 100px;
`
const ProjectFilterBox = styled.div`
  margin-bottom: 37px;
`
const ProjectListBox = styled.div``
