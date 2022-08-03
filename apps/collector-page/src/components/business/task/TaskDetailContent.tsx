import React from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { TaskAcceptedStatus, TaskTodoCompleteStatus, TaskType } from '../../../types/api'

import ChainTag from '../chain/ChainTag'
import { useNavigate } from 'react-router-dom'
import ButtonBase, { ButtonInfo, ButtonPrimary } from '../../common/button/ButtonBase'
import RichTextBox from '../../common/text/RichTextBox'

export type TaskDetailContentDataType = {
  id: number
  name: string
  image: string
  description: string
  type: TaskType
  startTime: number
  endTime: number
  winnerNum: number
  acceptedStatus: TaskAcceptedStatus
  status: TaskTodoCompleteStatus
  project: {
    id: number
    communityId: number
    chainId: number
    name: string
  }
}

export type TaskDetailContentViewConfigType = {
  displayConnectWallet?: boolean
  displayWalletBind?: boolean
  walletBindText?: string
  displayTake?: boolean
  disabledTake?: boolean
  loadingTake?: boolean
  displayCompleteStatus?: boolean
}

export type TaskDetailContentDataViewType = {
  data: TaskDetailContentDataType
  viewConfig?: TaskDetailContentViewConfigType
}

export type TaskDetailContentHandlesType = {
  onTake?: (task: TaskDetailContentDataType) => void
  onConnectWallet?: () => void
  onBindWallet?: () => void
}

export type TaskDetailContentProps = TaskDetailContentDataViewType & TaskDetailContentHandlesType

const defaultViewConfig: TaskDetailContentViewConfigType = {
  displayConnectWallet: false,
  displayWalletBind: false,
  walletBindText: 'Connect Wallet',
  displayTake: false,
  disabledTake: false,
  loadingTake: false,
  displayCompleteStatus: false,
}
const TaskTypeLabels = {
  [TaskType.WHITELIST_ORIENTED]: 'Whitelist-Oriented Task',
  [TaskType.WHITELIST_LUCK_DRAW]: 'Whitelist Luck Draw Task',
}

const TaskDetailContent: React.FC<TaskDetailContentProps> = ({
  data,
  viewConfig,
  onTake,
  onConnectWallet,
  onBindWallet,
}: TaskDetailContentProps) => {
  const { id, name, type, startTime, endTime, winnerNum, image, description, project } = data
  const {
    displayConnectWallet,
    disabledTake,
    displayTake,
    loadingTake,
    displayCompleteStatus,
    walletBindText,
    displayWalletBind,
  } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const taskTypeLabel = TaskTypeLabels[type] || 'Unknown Task Type'
  const startDate = new Date(startTime).toLocaleDateString()
  const endDate = new Date(endTime).toLocaleDateString()
  const handleTake = () => {
    if (onTake) {
      onTake(data)
    }
  }
  const handleWalletBind = () => {
    if (onBindWallet) {
      onBindWallet()
    }
  }
  const handleConnectWallet = () => {
    if (onConnectWallet) {
      onConnectWallet()
    }
  }
  const completeStatusLabel = data.status === TaskTodoCompleteStatus.COMPLETED ? 'Completed!' : 'Already Accepted'

  return (
    <TaskDetailContentWrapper>
      <TaskTypeLabel>{taskTypeLabel}</TaskTypeLabel>
      <TaskDateTimeBox>
        <TaskDateTime>
          {startDate}-{endDate}
        </TaskDateTime>
        <TaskWinners>Winners {winnerNum}</TaskWinners>
      </TaskDateTimeBox>
      <TaskDescription value={description} />
      {displayConnectWallet && <TaskBtn onClick={handleConnectWallet}>Connect Wallect</TaskBtn>}
      {displayWalletBind && <TaskBtn onClick={handleWalletBind}>{walletBindText}</TaskBtn>}
      {displayTake && (
        <TaskBtn disabled={disabledTake} onClick={handleTake}>
          {loadingTake ? 'loading...' : 'Take the task'}
        </TaskBtn>
      )}
      {displayCompleteStatus && <TaskCompleteStatus>{completeStatusLabel}</TaskCompleteStatus>}
    </TaskDetailContentWrapper>
  )
}
export default TaskDetailContent
const TaskDetailContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const TaskTypeLabel = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`
const TaskDateTimeBox = styled.div`
  display: flex;
  gap: 40px;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
`
const TaskDateTime = styled.span``
const TaskWinners = styled.span``

const TaskDescription = styled(RichTextBox)``
const TaskBtn = styled(ButtonPrimary)`
  width: 100%;
  font-weight: 700;
  font-size: 18px;
  color: #ffffff;
`

const TaskCompleteStatus = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 18px;
  box-sizing: border-box;
  gap: 10px;
  width: 100%;
  height: 48px;
  background: #f8f8f8;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`
