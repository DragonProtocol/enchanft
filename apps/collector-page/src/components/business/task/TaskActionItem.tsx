/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:46:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 18:24:44
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { ActionData, ActionType, TaskType, UserActionStatus } from '../../../types/api'
import ActionFollowCommunity from './actions/ActionFollowCommunity'
import ActionFollowTwitter from './actions/ActionFollowTwitter'

export type TaskActionItemDataType = {
  id: number
  name: string
  orderNum: number
  type: ActionType
  taskId: number
  projectId: number
  communityId: number
  data: ActionData
  status: UserActionStatus
}

const ActionComponents = {
  [ActionType.FOLLOW_TWITTER]: ActionFollowTwitter,
  [ActionType.FOLLOW_COMMUNITY]: ActionFollowCommunity,
}

export type TaskActionItemProps = {
  data: TaskActionItemDataType
}

const TaskActionItem: React.FC<TaskActionItemProps> = ({ data }: TaskActionItemProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, data: actionData, status } = data
  const ActionComponent = ActionComponents[type]
  let TaskStatusView = <TaskActionStatusTodo></TaskActionStatusTodo>
  switch (status) {
    case UserActionStatus.DONE:
      TaskStatusView = <TaskActionStatusDone>√</TaskActionStatusDone>
      break
  }
  return (
    <TaskActionItemWrapper>
      <TaskActionItemLeft>{TaskStatusView}</TaskActionItemLeft>
      <TaskActionItemRight>{ActionComponent ? <ActionComponent data={data} /> : name}</TaskActionItemRight>
    </TaskActionItemWrapper>
  )
}
export default TaskActionItem
const TaskActionItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
`
const TaskActionItemLeft = styled.div``
const TaskActionStatusTodo = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(21, 21, 21, 100);
`
const TaskActionStatusDoing = styled.div``
const TaskActionStatusDone = styled.div``

const TaskActionItemRight = styled.div`
  flex: 1;
`
