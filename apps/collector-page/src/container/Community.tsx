import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import {
  fetchRecommendTasks,
  selectAll as selectAllForRecommendTasks,
  TaskItemForEntity,
} from '../features/dashboard/recommendTasksSlice'
import {
  fetchProjects,
  ProjectItemForEntity,
  selectAll as selectAllForProjects,
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
import { TaskStatus } from '../types/api'
const formatStoreDataToComponentDataByRecommendTasks = (
  tasks: TaskItemForEntity[],
  token: string,
): TaskSwiperItemsType => {
  return tasks.map((task) => {
    const displayConnectWalletTip = token ? false : true
    const displayAccept = token && task.acceptedStatus === TaskStatus.DONE ? true : false
    const displayTake = token && task.acceptedStatus === TaskStatus.CANDO ? true : false
    const disabledTake = token ? false : true
    const loadingTake = false
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
const Community: React.FC = () => {
  const dispatch = useAppDispatch()

  // 获取推荐的任务
  const recommendTasks = useAppSelector(selectAllForRecommendTasks)
  useEffect(() => {
    dispatch(fetchRecommendTasks())
  }, [])

  // 获取项目列表
  const projects = useAppSelector(selectAllForProjects)
  const [projectsFilter, setProjectsFilter] = useState<ProjectFilterDataType>({
    status: ProjectStatusOther.All,
    keyword: '',
  })
  useEffect(() => {
    dispatch(fetchProjects(projectsFilter))
  }, [projectsFilter])

  // 展示数据
  const { token } = useAppSelector(selectAccount)
  const taskSwiperItems = formatStoreDataToComponentDataByRecommendTasks(recommendTasks, token)
  const projectListItems = formatStoreDataToComponentDataByProjects(projects)
  return (
    <CommunityWrapper>
      <ScrollBox>
        <MainContentBox>
          <TaskSwiperBox>
            <TaskSwiper items={taskSwiperItems} />
          </TaskSwiperBox>
          <ProjectFilterBox>
            <ProjectFilter data={projectsFilter} onChange={setProjectsFilter} />
          </ProjectFilterBox>
          <ProjectListBox>
            <ProjectList items={projectListItems} />
          </ProjectListBox>
        </MainContentBox>
      </ScrollBox>
    </CommunityWrapper>
  )
}
export default Community
const CommunityWrapper = styled.div`
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
