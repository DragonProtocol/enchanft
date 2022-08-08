/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-08 17:07:45
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { TaskType } from '../../../types/api'
import IconAlarmClock from '../../common/icons/IconAlarmClock'
import IconGiftBox from '../../common/icons/IconGiftBox'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import RichTextBox from '../../common/text/RichTextBox'
import TaskImageDefault from './TaskImageDefault'

export type ExploreTaskSwiperItemDataType = {
  id: number
  name: string
  image: string
  type: TaskType
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
  }
}
export type ExploreTaskSwiperItemViewConfigType = {}

export type ExploreTaskSwiperItemDataViewType = {
  data: ExploreTaskSwiperItemDataType
  viewConfig?: ExploreTaskSwiperItemViewConfigType
}
export type ExploreTaskSwiperItemHandlesType = {}

export type ExploreTaskSwiperItemProps = ExploreTaskSwiperItemDataViewType & ExploreTaskSwiperItemHandlesType

const TaskTypeLabels = {
  [TaskType.WHITELIST_ORIENTED]: 'Whitelist-Oriented Task',
  [TaskType.WHITELIST_LUCK_DRAW]: 'Whitelist Luck Draw',
}

const ExploreTaskSwiperItem: React.FC<ExploreTaskSwiperItemProps> = ({
  data,
  viewConfig,
}: ExploreTaskSwiperItemProps) => {
  const navigate = useNavigate()
  const { id, name, image, type, startTime, endTime, winnerNum, description, project, reward } = data
  const taskTypeLabel = TaskTypeLabels[type] || 'Unknown Task Type'
  const startDate = new Date(startTime).toLocaleDateString()
  const endDate = new Date(endTime).toLocaleDateString()
  return (
    <ExploreTaskSwiperItemWrapper>
      {/* <ChainTag size={2} chainId={project.chainId} /> */}
      <TaskImageBox>
        <TaskImage src={image} onClick={() => navigate(`/${project.slug}/${id}`)} />
      </TaskImageBox>

      <TaskInfoBox>
        <TaskName>{name}</TaskName>
        <ProjectName>Project: {project.name || 'Unknown'}</ProjectName>
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
  gap: 10px;
`
const TaskName = styled(OverflowEllipsisBox)`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  color: #333333;
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
const TaskRemark = styled(OverflowEllipsisBox)`
  flex: 1;
  font-size: 14px;
  color: #333333;
`
const TaskDescription = styled(RichTextBox)`
  flex: 1;
  overflow-y: auto;
  ${ScrollBarCss}
`
