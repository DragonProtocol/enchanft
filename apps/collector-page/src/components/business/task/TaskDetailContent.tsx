import React from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { RewardType, TaskAcceptedStatus, TaskTodoCompleteStatus, TaskType } from '../../../types/entities'
import RichTextBox from '../../common/text/RichTextBox'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import PngIconGiftBox from '../../common/icons/PngIconGiftBox'
import PngIconAlarmClock from '../../common/icons/PngIconAlarmClock'
import PngIconScissorHand from '../../common/icons/PngIconScissorHand'
import { getTaskRewardTypeLabel } from '../../../utils/task'

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
    type: RewardType
    raffled: boolean
  }
}

export type TaskDetailContentDataViewType = {
  data: TaskDetailContentDataType
}

export type TaskDetailContentProps = TaskDetailContentDataViewType

const TaskDetailContent: React.FC<TaskDetailContentProps> = ({ data }: TaskDetailContentProps) => {
  const { id, name, type, startTime, endTime, winnerNum, image, description, project, reward } = data
  const rewardTypeLabel = getTaskRewardTypeLabel(reward)
  const startDate = new Date(startTime).toLocaleDateString()
  const endDate = new Date(endTime).toLocaleDateString()

  return (
    <TaskDetailContentWrapper>
      <TaskTypeLabel>{rewardTypeLabel}</TaskTypeLabel>
      <TaskDateAndWinnerBox>
        <TaskDateAndWinnerItem>
          <PngIconAlarmClock size={'16px'} />
          <TaskDateTime>
            {startDate} -- {endDate}
          </TaskDateTime>
        </TaskDateAndWinnerItem>
        <TaskDateAndWinnerItem>
          <PngIconScissorHand size={'16px'} />
          <TaskWinners>Winners : {winnerNum}</TaskWinners>
        </TaskDateAndWinnerItem>
      </TaskDateAndWinnerBox>
      {reward && (
        <TaskRemarkBox>
          <PngIconGiftBox size={'16px'} />
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
  gap: 20px;
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`
const TaskDateAndWinnerItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  gap: 4px;

  background: #d3ed85;
  border-radius: 20px;
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
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`
const TaskDescription = styled(RichTextBox)`
  flex: 1;
  overflow-y: auto;
  ${ScrollBarCss}
`
