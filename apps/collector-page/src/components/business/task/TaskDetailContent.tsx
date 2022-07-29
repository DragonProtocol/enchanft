import { Button } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { TaskAcceptedStatus, TaskTodoCompleteStatus, TaskType } from '../../../types/api'
import ButtonBase from '../../common/button/ButtonBase'
import ChainTag from '../chain/ChainTag'
import { useNavigate } from 'react-router-dom'
import usePermissions from '../../../hooks/usePermissons'

export type TaskDetailContentDataType = {
  id: number
  name: string
  image: string
  description: string
  type: TaskType
  startTime: number
  endTime: number
  winnersNum: number
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
  displayAccept?: boolean
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
  navToCreator?: (task: TaskDetailContentDataType) => void
  onBindWallet?: () => void
}

export type TaskDetailContentProps = TaskDetailContentDataViewType & TaskDetailContentHandlesType

const defaultViewConfig: TaskDetailContentViewConfigType = {
  displayConnectWallet: false,
  displayWalletBind: false,
  walletBindText: 'Connect Wallet',
  displayAccept: false,
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
  navToCreator,
  onBindWallet,
}: TaskDetailContentProps) => {
  const navigate = useNavigate()
  const { isCreator, checkTaskAllowed } = usePermissions()
  const { id, name, type, startTime, endTime, winnersNum, image, description, project } = data
  const { id: projectId, communityId } = project
  const {
    displayConnectWallet,
    displayAccept,
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
      <TaskDetailHeader>
        <ProjectName onClick={() => navigate(`/community/${communityId}?projectId=${projectId}`)}>
          Project: {project.name || 'Unknown'}
        </ProjectName>
        {isCreator && <Button onClick={() => navToCreator && navToCreator(data)}>manage</Button>}
      </TaskDetailHeader>

      <TaskImageBox>
        <ChainTag size={2} chainId={project.chainId} />
        <TaskImage src={image} />
      </TaskImageBox>

      <TaskInfoBox>
        <TaskTypeLabel>{taskTypeLabel}</TaskTypeLabel>
        <TaskDateTime>
          {startDate}-{endDate}
        </TaskDateTime>
        <TaskWinners>Winners {winnersNum}</TaskWinners>
        <TaskDescription>{description}</TaskDescription>
        {displayAccept && <TaskAcceptedSeal>accept</TaskAcceptedSeal>}
      </TaskInfoBox>

      {displayConnectWallet && <ConnectWalleBindBtn onClick={handleConnectWallet}>Connect Wallect</ConnectWalleBindBtn>}
      {displayWalletBind && <ConnectWalleBindBtn onClick={handleWalletBind}>{walletBindText}</ConnectWalleBindBtn>}
      {displayTake && (
        <TaskTakeBtn disabled={disabledTake} onClick={handleTake}>
          {loadingTake ? 'loading...' : 'Take the task'}
        </TaskTakeBtn>
      )}
      {displayCompleteStatus && <TaskTakeBtn disabled={true}>{completeStatusLabel}</TaskTakeBtn>}
    </TaskDetailContentWrapper>
  )
}
export default TaskDetailContent
const TaskDetailContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const TaskDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const TaskImageBox = styled.div`
  position: relative;
`
const TaskImage = styled.img`
  width: 100%;
  height: 100%;
`
const TaskInfoBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
`
const ProjectName = styled.div`
  font-size: 20px;
  line-height: 30px;
  color: #3dd606;
  cursor: pointer;
`
const TaskTypeLabel = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`
const TaskDateTime = styled.span``
const TaskWinners = styled.span``

const TaskDescription = styled.div`
  flex: 1;
  font-size: 16px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.6);
  overflow-y: auto;
  ${ScrollBarCss}
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
const ConnectWalleBindBtn = styled(ButtonBase)`
  height: 47px;
  border-radius: 4px;
  background-color: rgba(21, 21, 21, 100);
  color: rgba(255, 255, 255, 100);
`
