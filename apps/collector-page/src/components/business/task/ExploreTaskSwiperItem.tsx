/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 15:29:19
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { TaskType } from '../../../types/api'

export type ExploreTaskSwiperItemDataType = {
  id: number
  name: string
  image: string
  type: TaskType
  startTime: number
  endTime: number
  winnersNum: number
  description: string
  project: {
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
  const { id, name, image, type, startTime, endTime, winnersNum, description, project } = data
  const taskTypeLabel = TaskTypeLabels[type] || 'Unknown Task Type'
  const startDate = new Date(startTime).toLocaleDateString()
  const endDate = new Date(endTime).toLocaleDateString()
  return (
    <ExploreTaskSwiperItemWrapper>
      <TaskImage src={image} />
      <TaskInfoBox>
        <TaskName>{name}</TaskName>
        <ProjectName>Project: {project.name || 'Unknown'}</ProjectName>
        <TaskTypeLabel>{taskTypeLabel}</TaskTypeLabel>
        <TaskDateAndWinnerBox>
          <TaskDateTime>
            {startDate}-{endDate}
          </TaskDateTime>
          <TaskWinners>Winners {winnersNum}</TaskWinners>
        </TaskDateAndWinnerBox>
        <TaskDescription>{description}</TaskDescription>
      </TaskInfoBox>
    </ExploreTaskSwiperItemWrapper>
  )
}
export default ExploreTaskSwiperItem
const ExploreTaskSwiperItemWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 40px;
`
const TaskImage = styled.img`
  width: 640px;
  height: 100%;
`
const TaskInfoBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const TaskName = styled.div`
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
