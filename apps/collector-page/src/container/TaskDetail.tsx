/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 15:52:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 19:12:29
 * @Description: file description
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { AsyncRequestStatus } from '../types'
import ScrollBox from '../components/common/ScrollBox'
import MainContentBox from '../components/layout/MainContentBox'
import { useParams } from 'react-router-dom'
import { fetchTaskDetail, selectTaskDetail, TaskDetailEntity } from '../features/task/taskDetailSlice'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import IconButton from '@mui/material/IconButton'
import TaskActionList, { TaskActionItemsType } from '../components/business/task/TaskActionList'
import { TaskAcceptedStatus, TodoTaskActionItem } from '../types/api'
import TaskDetailContent, { TaskDetailContentDataViewType } from '../components/business/task/TaskDetailContent'
import { selectUserTaskHandlesState, TakeTaskParams, TaskHandle } from '../features/user/taskHandlesSlice'
import { selectAccount } from '../features/user/accountSlice'
const formatStoreDataToComponentDataByTaskDetailContent = (
  task: TaskDetailEntity,
  token: string,
  takeTaskState: TaskHandle<TakeTaskParams>,
): TaskDetailContentDataViewType => {
  const displayConnectWalletTip = token ? false : true
  const displayAccept = token && task.acceptedStatus === TaskAcceptedStatus.DONE ? true : false
  const displayTake = token && task.acceptedStatus === TaskAcceptedStatus.CANDO ? true : false
  const loadingTake = takeTaskState.params?.id === task.id && takeTaskState.status === AsyncRequestStatus.PENDING
  const disabledTake = !token || loadingTake ? true : false
  const displayGoToTasks = displayAccept
  return {
    data: task,
    viewConfig: {
      displayConnectWalletTip,
      displayAccept,
      displayGoToTasks,
      displayTake,
      disabledTake,
      loadingTake,
    },
  }
}
const formatStoreDataToComponentDataByTaskActions = (actions: TodoTaskActionItem[]): TaskActionItemsType => {
  return [...actions].sort((a, b) => a.orderNum - b.orderNum)
}
const TaskDetail: React.FC = () => {
  const dispatch = useAppDispatch()
  const { token } = useAppSelector(selectAccount)

  const { id } = useParams()
  const { status, data } = useAppSelector(selectTaskDetail)
  useEffect(() => {
    dispatch(fetchTaskDetail(Number(id)))
  }, [id])
  console.log({ data })
  // 接任务的状态
  const { take: takeTaskState } = useAppSelector(selectUserTaskHandlesState)
  // 展示数据
  const loading = status === AsyncRequestStatus.PENDING ? true : false
  if (!loading && !data) return null
  const taskDetailContent = data ? formatStoreDataToComponentDataByTaskDetailContent(data, token, takeTaskState) : null
  const actionItems = formatStoreDataToComponentDataByTaskActions(data?.actions || [])
  return (
    <TaskDetailWrapper>
      <ScrollBox>
        <MainContentBox>
          <TaskDetailBodyBox>
            {loading ? (
              <TaskDetailLoading>Loading ... </TaskDetailLoading>
            ) : (
              <>
                <DetailHeader>
                  <IconButton>
                    <ArrowBackIosIcon />
                  </IconButton>
                  <TaskName>{data?.name}</TaskName>
                </DetailHeader>
                {taskDetailContent && (
                  <TaskDetailContentBox>
                    <TaskDetailContent data={taskDetailContent.data} viewConfig={taskDetailContent.viewConfig} />
                  </TaskDetailContentBox>
                )}
                <TaskActionsBox>
                  <TaskActionList items={actionItems} />
                </TaskActionsBox>
              </>
            )}
          </TaskDetailBodyBox>
        </MainContentBox>
      </ScrollBox>
    </TaskDetailWrapper>
  )
}
export default TaskDetail
const TaskDetailWrapper = styled.div`
  width: 100%;
  height: 100%;
`
const TaskDetailBodyBox = styled.div`
  max-width: 800px;
  margin: 0 auto;
`
const DetailHeader = styled.div`
  width: 100%;
  display: flex;
  gap: 40px;
  align-items: center;
`
const TaskName = styled.div`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
`
const TaskDetailLoading = styled.div`
  width: 100%;
  text-align: center;
`
const TaskDetailContentBox = styled.div`
  margin-top: 40px;
`
const TaskActionsBox = styled.div`
  margin-top: 40px;
`
