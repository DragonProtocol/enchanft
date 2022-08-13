import React from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { TaskAcceptedStatus, TaskTodoCompleteStatus, TaskType } from '../../../types/api'
import RichTextBox from '../../common/text/RichTextBox'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import IconGiftBox from '../../common/icons/IconGiftBox'
import IconAlarmClock from '../../common/icons/IconAlarmClock'

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
  reward?: {
    name: string
  }
}

export type TaskDetailContentDataViewType = {
  data: TaskDetailContentDataType
}

export type TaskDetailContentProps = TaskDetailContentDataViewType

const TaskTypeLabels = {
  [TaskType.WHITELIST_ORIENTED]: 'Whitelist-Oriented Task',
  [TaskType.WHITELIST_LUCK_DRAW]: 'Whitelist Luck Draw Task',
}

const TaskDetailContent: React.FC<TaskDetailContentProps> = ({ data }: TaskDetailContentProps) => {
  const { id, name, type, startTime, endTime, winnerNum, image, description, project, reward } = data
  const taskTypeLabel = TaskTypeLabels[type] || 'Unknown Task Type'
  const startDate = new Date(startTime).toLocaleDateString()
  const endDate = new Date(endTime).toLocaleDateString()

  return (
    <TaskDetailContentWrapper>
      <TaskTypeLabel>{taskTypeLabel}</TaskTypeLabel>
      <TaskDateAndWinnerBox>
        <TaskDateTimeBox>
          <IconAlarmClock size={'18px'} />
          <TaskDateTime>
            {startDate} -- {endDate}
          </TaskDateTime>
        </TaskDateTimeBox>
        <TaskWinners>Winners {winnerNum}</TaskWinners>
      </TaskDateAndWinnerBox>
      {reward && (
        <TaskRemarkBox>
          <IconGiftBox size={'18px'} />
          <TaskRemark>Reward : {reward.name}</TaskRemark>
        </TaskRemarkBox>
      )}

      <TaskDescription value={description} />
    </TaskDetailContentWrapper>
  )
}
export default TaskDetailContent
const TaskDetailContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const TaskTypeLabel = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`
const TaskDateAndWinnerBox = styled.div`
  display: flex;
  gap: 40px;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
`
const TaskDateTimeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
const TaskDateTime = styled.span``
const TaskWinners = styled.span``
const TaskRemarkBox = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`
const TaskRemark = styled.span`
  flex: 1;
  font-size: 14px;
  color: #333333;
`
const TaskDescription = styled(RichTextBox)`
  flex: 1;
  overflow-y: auto;
  ${ScrollBarCss}
`
