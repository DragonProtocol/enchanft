/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:52:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 10:22:01
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'

export type ExploreTaskItemDataType = {
  id: number
  image: string
  name: string
  startTime: number
  endTime: number
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
  const { id, name, image, startTime, endTime } = data
  const {} = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const startDate = new Date(startTime).toLocaleDateString()
  const endDate = new Date(endTime).toLocaleDateString()
  return (
    <ExploreTaskItemWrapper onClick={() => navigate(`/task/${id}`)}>
      <TaskImage src={image} />
      <TaskInfoBox>
        <TaskName>{name}</TaskName>
        <TaskDateTime>
          {startDate} —— {endDate}
        </TaskDateTime>
      </TaskInfoBox>
    </ExploreTaskItemWrapper>
  )
}
export default ExploreTaskItem
const ExploreTaskItemWrapper = styled.div`
  width: 100%;
  height: 330px;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 100);
  border: 1px solid rgba(21, 21, 21, 100);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
`
const TaskImage = styled.img`
  width: 100%;
  height: 206px;
`
const TaskInfoBox = styled.div`
  flex: 1;
  padding-top: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  ${ScrollBarCss}
`
const TaskName = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  font-weight: bold;
`
const TaskDateTime = styled.div`
  font-size: 14px;
`
