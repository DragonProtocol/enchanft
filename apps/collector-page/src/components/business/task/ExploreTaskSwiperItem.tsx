/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-02 14:17:21
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { TaskType } from '../../../types/api'
import RichTextBox from '../../common/text/RichTextBox'
import ChainTag from '../chain/ChainTag'

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
  const { id, name, image, type, startTime, endTime, winnerNum, description, project } = data
  const taskTypeLabel = TaskTypeLabels[type] || 'Unknown Task Type'
  const startDate = new Date(startTime).toLocaleDateString()
  const endDate = new Date(endTime).toLocaleDateString()
  return (
    <ExploreTaskSwiperItemWrapper>
      <ChainTag size={2} chainId={project.chainId} />
      <TaskImage src={image} onClick={() => navigate(`/${project.slug}/${id}`)} />
      <TaskInfoBox>
        <TaskName>{name}</TaskName>
        <ProjectName>Project: {project.name || 'Unknown'}</ProjectName>
        <TaskTypeLabel>{taskTypeLabel}</TaskTypeLabel>
        <TaskDateAndWinnerBox>
          <TaskDateTime>
            {startDate}-{endDate}
          </TaskDateTime>
          <TaskWinners>Winners {winnerNum}</TaskWinners>
        </TaskDateAndWinnerBox>
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
const TaskImage = styled.img`
  width: 50%;
  height: 100%;
  cursor: pointer;
  /* 图片不失真 ,保持其宽高比, 多余的会被剪切*/
  object-fit: cover;
`
const TaskInfoBox = styled.div`
  width: 50%;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const TaskName = styled.div`
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
const TaskDateTime = styled.span``
const TaskWinners = styled.span``

const TaskDescription = styled(RichTextBox)`
  flex: 1;
  overflow-y: auto;
  ${ScrollBarCss}
`
