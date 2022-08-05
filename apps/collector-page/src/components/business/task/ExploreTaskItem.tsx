/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:52:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-04 14:03:05
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import IconGiftBox from '../../common/icons/IconGiftBox'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import ChainTag from '../chain/ChainTag'

export type ExploreTaskItemDataType = {
  id: number
  image: string
  name: string
  startTime: number
  endTime: number
  project: {
    slug: string
    chainId: number
  }
  reward: {
    name: string
  }
}

export type ExploreTaskItemViewConfigType = {}

export type ExploreTaskItemDataViewType = {
  data: ExploreTaskItemDataType
  viewConfig?: ExploreTaskItemViewConfigType
}

export type ExploreTaskItemProps = ExploreTaskItemDataViewType

const defaultViewConfig = {}
const ExploreTaskItem: React.FC<ExploreTaskItemProps> = ({ data, viewConfig }: ExploreTaskItemProps) => {
  const navigate = useNavigate()
  const { id, name, image, startTime, endTime, project, reward } = data
  const {} = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const startDate = new Date(startTime).toLocaleDateString()
  const endDate = new Date(endTime).toLocaleDateString()
  return (
    <ExploreTaskItemWrapper onClick={() => navigate(`/${project.slug}/${id}`)}>
      <TaskImageBox>
        <ChainTag size={1} chainId={project.chainId} />
        <TaskImage src={image} />
      </TaskImageBox>
      <TaskInfoBox>
        <TaskName>{name}</TaskName>
        <TaskDateTime>
          {startDate} —— {endDate}
        </TaskDateTime>
        <TaskRemarkBox>
          <IconGiftBox size={'16px'} />
          <TaskRemark>{reward.name}</TaskRemark>
        </TaskRemarkBox>
      </TaskInfoBox>
    </ExploreTaskItemWrapper>
  )
}
export default ExploreTaskItem
const ExploreTaskItemWrapper = styled.div`
  width: 100%;
  height: 250px;
  box-sizing: border-box;
  background: #ffffff;
  border: 2px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
`
const TaskImageBox = styled.div`
  width: 100%;
  height: 130px;
  position: relative;
`
const TaskImage = styled.img`
  width: 100%;
  height: 100%;
  /* 图片不失真，不会出现拉伸 */
  object-fit: cover;
`
const TaskInfoBox = styled.div`
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  overflow-y: scroll;
  ${ScrollBarCss}
`
const TaskName = styled(OverflowEllipsisBox)`
  font-weight: 700;
  font-size: 18px;
  color: #333333;
  flex-shrink: 0;
`
const TaskDateTime = styled.div`
  font-size: 12px;
  color: rgba(51, 51, 51, 0.6);
`
const TaskRemarkBox = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`
const TaskRemark = styled(OverflowEllipsisBox)`
  flex: 1;
  font-size: 12px;
  color: #333333;
`
