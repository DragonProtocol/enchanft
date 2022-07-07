/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:39:25
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-07 20:47:42
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
  actions: Array<{
    id: number
    name: string
  }>
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
  const { id, name, type, startTime, endTime, winnersNum, acceptedStatus, actions } = data
  const { disabledTake, displayTake } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const typeLabel = TaskTypeLabels[type] || 'Unknown Task Type'
  const startDate = new Date(startTime).toLocaleDateString()
  const endDate = new Date(endTime).toLocaleDateString()
  return (
    <TaskContentWrapper>
      <TaskName>{name}</TaskName>
      <TaskContentRow>
        <span>{typeLabel}</span>
        <span>winners {winnersNum}</span>
      </TaskContentRow>
      <TaskContentRow>
        {startDate} ———— {endDate}
      </TaskContentRow>
      <TaskContentRow>task statements</TaskContentRow>
      <TaskActionsBox>
        {actions.map((item) => (
          <TaskActionsItem key={item.id}>
            <TaskActionsItemLeft></TaskActionsItemLeft>
            <span>{item.name}</span>
          </TaskActionsItem>
        ))}
      </TaskActionsBox>
    </TaskContentWrapper>
  )
}
export default TaskContent
const TaskContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const TaskName = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  font-weight: bold;
`
const TaskContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
`
const TaskActionsBox = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
`
const TaskActionsItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
`
const TaskActionsItemLeft = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(21, 21, 21, 100);
`
