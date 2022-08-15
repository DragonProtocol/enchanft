/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-15 14:49:42
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { RewardType } from '../../../types/entities'
import IconAlarmClock from '../../common/icons/IconAlarmClock'
import IconGiftBox from '../../common/icons/IconGiftBox'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import RichTextToPlainTextSpan from '../../common/text/RichTextToPlainTextSpan'
import TaskImageDefault from './TaskImageDefault'

export type ExploreTaskSwiperItemDataType = {
  id: number
  name: string
  image: string
  startTime: number
  endTime: number
  winnerNum: number
  description: string
  project: {
    slug: string
    chainId: number
    name: string
  }
  reward?: {
    name: string
    type: RewardType
    raffled: boolean
  }
}
export type ExploreTaskSwiperItemViewConfigType = {}

export type ExploreTaskSwiperItemDataViewType = {
  data: ExploreTaskSwiperItemDataType
  viewConfig?: ExploreTaskSwiperItemViewConfigType
}
export type ExploreTaskSwiperItemHandlesType = {}

export type ExploreTaskSwiperItemProps = ExploreTaskSwiperItemDataViewType & ExploreTaskSwiperItemHandlesType

const ExploreTaskSwiperItem: React.FC<ExploreTaskSwiperItemProps> = ({
  data,
  viewConfig,
}: ExploreTaskSwiperItemProps) => {
  const navigate = useNavigate()
  const { id, name, image, startTime, endTime, winnerNum, description, project, reward } = data
  let taskTypeLabel = 'Unknown Reward Type'
  if (reward) {
    switch (reward.type) {
      case RewardType.WHITELIST:
        taskTypeLabel = reward.raffled ? 'Whitelist Luck Draw' : 'Whitelist-Oriented Task'
        break
      case RewardType.OTHERS:
        taskTypeLabel = 'Other Reward'
        break
    }
  }
  const startDate = new Date(startTime).toLocaleDateString()
  const endDate = new Date(endTime).toLocaleDateString()
  return (
    <ExploreTaskSwiperItemWrapper>
      {/* <ChainTag size={2} chainId={project.chainId} /> */}
      <TaskImageBox>
        <TaskImage src={image} onClick={() => navigate(`/${project.slug}/${id}`)} />
      </TaskImageBox>

      <TaskInfoBox>
        <TaskInfoTopBox>
          <TaskName>{name}</TaskName>
          <ProjectName>Project: {project.name || 'Unknown'}</ProjectName>
        </TaskInfoTopBox>
        <TaskInfoBottomBox>
          <TaskTypeLabel>{taskTypeLabel}</TaskTypeLabel>
          <TaskDateAndWinnerBox>
            <TaskDateTimeBox>
              <IconAlarmClock size={'18px'} />
              <TaskDateTime>
                {startDate} —— {endDate}
              </TaskDateTime>
            </TaskDateTimeBox>
            <TaskWinners>Winners {winnerNum}</TaskWinners>
          </TaskDateAndWinnerBox>
          {reward && (
            <TaskRewardBox>
              <IconGiftBox size={'18px'} />
              <TaskReward>Reward : {reward.name}</TaskReward>
            </TaskRewardBox>
          )}
          <TaskDescription>
            <RichTextToPlainTextSpan value={description} />
          </TaskDescription>
        </TaskInfoBottomBox>
      </TaskInfoBox>
    </ExploreTaskSwiperItemWrapper>
  )
}
export default ExploreTaskSwiperItem
const ExploreTaskSwiperItemWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`
const TaskImageBox = styled.div`
  width: 50%;
  height: 100%;
  overflow: hidden;
`
const TaskImage = styled(TaskImageDefault)`
  width: 100%;
  height: 100%;
  cursor: pointer;
  /* 图片不失真 ,保持其宽高比, 多余的会被剪切*/
  object-fit: cover;
  /* 鼠标移入时, 放大图片10%, 0.5s完成 */
  &:hover {
    transform: scale(1.1);
  }
  /** 鼠标点下，下沉2px */
  &:active {
    transform: translateY(2px);
  }
  transition: all 0.5s ease-out;
`
const TaskInfoBox = styled.div`
  width: 50%;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px;
`
const TaskInfoTopBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const TaskInfoBottomBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  box-sizing: border-box;
`
const TaskName = styled(OverflowEllipsisBox)`
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  color: #333333;
`
const ProjectName = styled.div`
  font-size: 18px;
  line-height: 27px;
  color: #3dd606;
`
const TaskTypeLabel = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`
const TaskDateAndWinnerBox = styled.div`
  display: flex;
  gap: 60px;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`
const TaskDateTimeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
const TaskDateTime = styled.span``
const TaskWinners = styled.span``
const TaskRewardBox = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`
const TaskReward = styled(OverflowEllipsisBox)`
  flex: 1;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`
const TaskDescription = styled(OverflowEllipsisBox)`
  font-size: 14px;
  line-height: 21px;
  color: rgba(51, 51, 51, 0.6);
`
