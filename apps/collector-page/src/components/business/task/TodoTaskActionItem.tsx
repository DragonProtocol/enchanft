/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:46:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-18 13:22:05
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { ActionData, ActionType, TaskType, UserActionStatus } from '../../../types/api'
import ActionFollowCommunity from './actions/ActionFollowCommunity'
import ActionFollowTwitter from './actions/ActionFollowTwitter'

export type TodoTaskActionItemDataType = {
  id: number
  name: string
  orderNum: number
  type: ActionType
  taskId: number
  projectId: number
  communityId: number
  data: ActionData
  status: UserActionStatus
  progress: string
}

const ActionComponents = {
  [ActionType.FOLLOW_TWITTER]: ActionFollowTwitter,
  [ActionType.FOLLOW_COMMUNITY]: ActionFollowCommunity,
}

export type TodoTaskActionItemProps = {
  data: TodoTaskActionItemDataType
}

const TodoTaskActionItem: React.FC<TodoTaskActionItemProps> = ({ data }: TodoTaskActionItemProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, data: actionData, status, progress } = data
  const ActionComponent = ActionComponents[type]
  let TaskStatusView = <TaskActionStatusTodo></TaskActionStatusTodo>
  switch (status) {
    case UserActionStatus.DONE:
      TaskStatusView = <TaskActionStatusDone>√</TaskActionStatusDone>
      break
  }
  return (
    <TodoTaskActionItemWrapper>
      <TaskActionItemLeft>{TaskStatusView}</TaskActionItemLeft>
      <TaskActionItemRight>{ActionComponent ? <ActionComponent data={data} /> : name}</TaskActionItemRight>
    </TodoTaskActionItemWrapper>
  )
}
export default TodoTaskActionItem
const TodoTaskActionItemWrapper = styled.div`
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
