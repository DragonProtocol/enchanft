/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-06 18:56:54
 * @Description: 首页任务看板
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { fetchRecommendTasks, selectAll as selectAllForRecommendTasks } from '../features/dashboard/recommendTasksSlice'
import { fetchProjects, selectAll as selectAllForProjects } from '../features/dashboard/projectsSlice'
import { fetchListForProjectParams } from '../services/api/dashboard'

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch()

  // 获取推荐的任务
  const recommendTasks = useAppSelector(selectAllForRecommendTasks)
  useEffect(() => {
    dispatch(fetchRecommendTasks())
  }, [])

  // 获取项目列表
  const projects = useAppSelector(selectAllForProjects)
  const projectsFilter = useState<fetchListForProjectParams>({
    status: '',
    keyword: '',
  })
  useEffect(() => {
    dispatch(fetchProjects(projectsFilter))
  }, [projectsFilter])

  useEffect(() => {
    console.log({
      recommendTasks,
      projects,
    })
  }, [recommendTasks, projects])
  console.log('111')

  return <DashboardWrapper>Dashboard</DashboardWrapper>
}
export default Dashboard
const DashboardWrapper = styled.div`
  width: 100%;
  height: 100%;
`
