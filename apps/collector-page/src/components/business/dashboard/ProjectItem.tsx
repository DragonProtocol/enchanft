/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:52:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-12 17:48:10
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { ProjectStatus, TaskType } from '../../../types/api'

export type ProjectItemDataType = {
  id: number
  name: string
  image: string
  status: ProjectStatus
  floorPrice: string
  injectedCoins: number
  itemTotalNum: number
  mintPrice: string
  mintStartTime: number
  publicSaleTime: number
  publicSalePrice: string
  communityId: number
  tasks: Array<{
    type: TaskType
    startTime: number
    endTime: number
  }>
}

export type ProjectItemViewConfigType = {}

export type ProjectItemDataViewType = {
  data: ProjectItemDataType
  viewConfig?: ProjectItemViewConfigType
}

export type ProjectItemProps = ProjectItemDataViewType

const defaultViewConfig = {}
const ProjectStatusLabels = {
  [ProjectStatus.ACTIVE]: 'Active',
  [ProjectStatus.LIVE]: 'Live',
  [ProjectStatus.FUTURE]: 'Future',
}
const TaskTypeLabels = {
  [TaskType.WHITELIST_ORIENTED]: 'Whitelist',
  [TaskType.WHITELIST_LUCK_DRAW]: 'Raffle',
}
const ProjectItem: React.FC<ProjectItemProps> = ({ data, viewConfig }: ProjectItemProps) => {
  const navigate = useNavigate()
  const { id, name, image, status, floorPrice, itemTotalNum, communityId, tasks, publicSaleTime } = data
  // const {} = {
  //   ...defaultViewConfig,
  //   ...viewConfig,
  // }

  const statusLabel = ProjectStatusLabels[status] || 'Unknown Project Status'
  let projectDescBottomText = ''
  switch (status) {
    case ProjectStatus.ACTIVE:
      // 距离结束时间的天数
      const task = tasks[0]
      const days = task ? Math.floor((task.endTime - Date.now()) / (1000 * 60 * 60 * 24)) : 0
      const taskTypeLabel = TaskTypeLabels[task?.type] || 'Unknown Task Type'
      projectDescBottomText = `${tasks.length} task . ${days} days . ${taskTypeLabel}`
      break
    case ProjectStatus.LIVE:
      projectDescBottomText = `items ${itemTotalNum} . Floor Price ${floorPrice} SOL`
      break
    case ProjectStatus.FUTURE:
      // 预发售日期
      const publicMintStartDate = new Date(publicSaleTime).toLocaleDateString()
      projectDescBottomText = `items ${itemTotalNum} . Mint Price ${floorPrice} SOL ${publicMintStartDate}`
  }
  return (
    <ProjectItemWrapper onClick={() => navigate(`/community/${communityId}/${id}`)}>
      <ProjectImage src={image} />
      <ProjectDescBox>
        <ProjectDescTopBox>
          <ProjectName>{name}</ProjectName>
          <ProjectStatusLabel>
            <ProjectStatusLabelLeft />
            {statusLabel}
          </ProjectStatusLabel>
        </ProjectDescTopBox>
        <ProjectDescBottomBox>{projectDescBottomText}</ProjectDescBottomBox>
      </ProjectDescBox>
    </ProjectItemWrapper>
  )
}
export default ProjectItem
const ProjectItemWrapper = styled.div`
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
const ProjectImage = styled.img`
  width: 100%;
  height: 206px;
`
const ProjectDescBox = styled.div`
  flex: 1;
  padding-top: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  ${ScrollBarCss}
`
// top
const ProjectDescTopBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
`
const ProjectName = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  font-weight: bold;
`
const ProjectStatusLabel = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`
const ProjectStatusLabelLeft = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  line-height: 20px;
  background-color: rgba(112, 225, 55, 100);
`
// bottom
const ProjectDescBottomBox = styled.div`
  font-size: 14px;
`
