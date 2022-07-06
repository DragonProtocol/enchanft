/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:39:25
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-06 18:21:16
 * @Description:（公开面板上的）任务内容
 */
import React from 'react'
import styled from 'styled-components'
import { TaskStatus, TaskType } from '../../../types/api'

export type TaskContentDataType = {
  id: number
  name: string
  type: TaskType
  startTime: number
  endTime: number
  winnersNum: number
  acceptedStatus: TaskStatus
}

export type TaskContentViewConfigType = {
  displayTake?: boolean
  disabledTake?: boolean
  loadingTake?: boolean
}

export type TaskContentDataViewType = {
  data: TaskContentDataType
  viewConfig?: TaskContentViewConfigType
}

export type TaskContentHandlesType = {
  onTake?: (TaskSwiper: TaskContentDataType) => void
}

export type TaskContentProps = TaskContentDataViewType & TaskContentHandlesType

const defaultViewConfig: TaskContentViewConfigType = {
  displayTake: false,
  disabledTake: false,
  loadingTake: false,
}
const TaskTypeLabels = {
  [TaskType.WHITELIST_ORIENTED]: 'Whitelist-Oriented Task',
  [TaskType.WHITELIST_LUCK_DRAW]: 'Whitelist Luck Draw',
}

const TaskContent: React.FC<TaskContentProps> = ({ data, viewConfig, onTake }: TaskContentProps) => {
  const { id, name, type, startTime, endTime, winnersNum, acceptedStatus } = data
  const { disabledTake, displayTake } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const typeLabel = TaskTypeLabels[type] || 'Unknown Task Type'
  return <TaskContentWrapper>aaa</TaskContentWrapper>
}
export default TaskContent
const TaskContentWrapper = styled.div``
