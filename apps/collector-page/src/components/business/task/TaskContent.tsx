/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:39:25
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-13 11:15:20
 * @Description:（公开面板上的）任务内容
 */
import React from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { TaskAcceptedStatus, TaskType } from '../../../types/api'
import ButtonBase from '../../common/button/ButtonBase'
import SolanaConnectWalletButton from '../connect/SolanaConnectWalletButton'

export type TaskContentDataType = {
  id: number
  name: string
  type: TaskType
  startTime: number
  endTime: number
  winnersNum: number
  acceptedStatus: TaskAcceptedStatus
  actions: Array<{
    id: number
    name: string
  }>
}

export type TaskContentViewConfigType = {
  displayConnectWalletTip?: boolean
  displayAccept?: boolean
  displayTake?: boolean
  disabledTake?: boolean
  loadingTake?: boolean
}

export type TaskContentDataViewType = {
  data: TaskContentDataType
  viewConfig?: TaskContentViewConfigType
}

export type TaskContentHandlesType = {
  onTake?: (task: TaskContentDataType) => void
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
  const { name, type, startTime, endTime, winnersNum, actions } = data
  const { displayConnectWalletTip, displayAccept, disabledTake, displayTake, loadingTake } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const typeLabel = TaskTypeLabels[type] || 'Unknown Task Type'
  const startDate = new Date(startTime).toLocaleDateString()
  const endDate = new Date(endTime).toLocaleDateString()
  const handleTake = () => {
    if (onTake) {
      onTake(data)
    }
  }
  return (
    <TaskContentWrapper>
      <TaskName>{name}</TaskName>
      <TaskContentRow>
        <span>{typeLabel}</span>
        <span>winners {winnersNum}</span>
      </TaskContentRow>
      <TaskContentRow>
        {startDate} —— {endDate}
      </TaskContentRow>
      <TaskContentRow>task statements</TaskContentRow>
      <TaskActionsBox>
        {actions.map((item) => (
          <TaskActionsItem key={item.id}>
            <TaskActionsItemLeft></TaskActionsItemLeft>
            <TaskActionsItemRight>{item.name}</TaskActionsItemRight>
          </TaskActionsItem>
        ))}
      </TaskActionsBox>
      {displayTake && (
        <TaskTakeBtn disabled={disabledTake} onClick={handleTake}>
          {loadingTake ? 'loading...' : 'Take the task'}
        </TaskTakeBtn>
      )}
      {displayAccept && <TaskAcceptedSeal>accept</TaskAcceptedSeal>}
      {displayConnectWalletTip && <SolanaConnectWalletButton />}
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
  position: relative;
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
  ${ScrollBarCss}
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
const TaskActionsItemRight = styled.div`
  flex: 1;
`
const TaskTakeBtn = styled(ButtonBase)`
  height: 47px;
  border-radius: 4px;
  background-color: rgba(21, 21, 21, 100);
  color: rgba(255, 255, 255, 100);
`
const TaskAcceptedSeal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  width: 240px;
  height: 240px;
  border-radius: 50%;
  border: 5px solid rgba(240, 76, 71, 100);
  line-height: 240px;
  text-align: center;
  color: rgba(240, 76, 71, 100);
  font-size: 48px;
  font-weight: 500;
  text-transform: uppercase;
`
