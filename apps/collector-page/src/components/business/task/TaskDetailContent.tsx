import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { TaskAcceptedStatus, TaskType } from '../../../types/api'
import ButtonBase from '../../common/button/ButtonBase'
import ChainTag from '../chain/ChainTag'
import SolanaConnectWalletButton from '../connect/SolanaConnectWalletButton'

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
  project: {
    chainId: number
    name: string
  }
}

export type TaskDetailContentViewConfigType = {
  displayConnectWalletTip?: boolean
  displayAccept?: boolean
  displayGoToTasks?: boolean
  displayTake?: boolean
  disabledTake?: boolean
  loadingTake?: boolean
}

export type TaskDetailContentDataViewType = {
  data: TaskDetailContentDataType
  viewConfig?: TaskDetailContentViewConfigType
}

export type TaskDetailContentHandlesType = {
  onTake?: (task: TaskDetailContentDataType) => void
}

export type TaskDetailContentProps = TaskDetailContentDataViewType & TaskDetailContentHandlesType

const defaultViewConfig: TaskDetailContentViewConfigType = {
  displayGoToTasks: false,
  displayTake: false,
  disabledTake: false,
  loadingTake: false,
}
const TaskTypeLabels = {
  [TaskType.WHITELIST_ORIENTED]: 'Whitelist-Oriented Task',
  [TaskType.WHITELIST_LUCK_DRAW]: 'Whitelist Luck Draw',
}

const TaskDetailContent: React.FC<TaskDetailContentProps> = ({ data, viewConfig, onTake }: TaskDetailContentProps) => {
  const navigate = useNavigate()
  const { id, name, type, startTime, endTime, winnersNum, image, description, project } = data
  const { displayConnectWalletTip, displayAccept, displayGoToTasks, disabledTake, displayTake, loadingTake } = {
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
  return (
    <TaskDetailContentWrapper>
      <ProjectName>Project: {project.name || 'Unknown'}</ProjectName>
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
      {displayTake && (
        <TaskTakeBtn disabled={disabledTake} onClick={handleTake}>
          {loadingTake ? 'loading...' : 'Take the task'}
        </TaskTakeBtn>
      )}
      {displayGoToTasks && <TaskTakeBtn onClick={() => navigate(`/todo?taskId=${id}`)}>Go To Tasks</TaskTakeBtn>}

      {displayConnectWalletTip && <SolanaConnectWalletButton />}
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
