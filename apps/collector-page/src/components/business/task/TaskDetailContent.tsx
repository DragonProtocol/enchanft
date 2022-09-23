import React from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { RewardData, RewardType, TaskAcceptedStatus, TaskTodoCompleteStatus, TaskType } from '../../../types/entities'
import RichTextBox from '../../common/text/RichTextBox'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import PngIconGiftBox from '../../common/icons/PngIconGiftBox'
import PngIconAlarmClock from '../../common/icons/PngIconAlarmClock'
import PngIconScissorHand from '../../common/icons/PngIconScissorHand'
import { getTaskRewardTypeLabel, getTaskRewardTypeValue } from '../../../utils/task'
import { MOBILE_BREAK_POINT } from '../../../constants'
import { formatDateTime } from '../../../utils/time'

export type TaskDetailContentDataType = {
  id: number
  name: string
  image: string
  description: string
  type: TaskType
  startTime: number
  endTime: number
  winnerNum?: number
  reward?: {
    name: string
    type: RewardType
    raffled: boolean
    data: RewardData
  }
}

export type TaskDetailContentDataViewType = {
  data: TaskDetailContentDataType
}

export type TaskDetailContentProps = TaskDetailContentDataViewType

const TaskDetailContent: React.FC<TaskDetailContentProps> = ({ data }: TaskDetailContentProps) => {
  const { id, name, type, startTime, endTime, winnerNum, image, description, reward } = data
  const rewardTypeLabel = getTaskRewardTypeLabel(reward)
  const startDate = formatDateTime(startTime)
  const endDate = formatDateTime(endTime)
  const rewardValue = getTaskRewardTypeValue(reward)
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
        {winnerNum !== undefined && (
          <TaskDateAndWinnerItem>
            <PngIconScissorHand size={'16px'} />
            <TaskWinners>Winners : {winnerNum}</TaskWinners>
          </TaskDateAndWinnerItem>
        )}
      </TaskDateAndWinnerBox>
      {reward && (
        <TaskRemarkBox>
          <PngIconGiftBox size={'16px'} />
          <TaskRemark>Reward : {rewardValue}</TaskRemark>
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
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    gap: 8px;
  }
`
const TaskTypeLabel = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 14px;
    line-height: 21px;
  }
`
const TaskDateAndWinnerBox = styled.div`
  display: flex;
  gap: 20px;
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    font-size: 12px;
    line-height: 18px;
  }
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
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
    line-height: 18px;
  }
`
const TaskDescription = styled(RichTextBox)`
  flex: 1;
  overflow-y: auto;
  ${ScrollBarCss}
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: rgba(51, 51, 51, 0.6);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
    line-height: 18px;
  }
`
