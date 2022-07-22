/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:52:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-22 20:06:48
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { ProjectStatus, TaskType } from '../../../types/api'
import ChainTag from '../chain/ChainTag'

export type ExploreProjectItemDataType = {
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
  chainId: number
  tasks: Array<{
    type: TaskType
    startTime: number
    endTime: number
  }>
}

export type ExploreProjectItemViewConfigType = {}

export type ExploreProjectItemDataViewType = {
  data: ExploreProjectItemDataType
  viewConfig?: ExploreProjectItemViewConfigType
}

export type ExploreProjectItemProps = ExploreProjectItemDataViewType

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
const ExploreProjectItem: React.FC<ExploreProjectItemProps> = ({ data, viewConfig }: ExploreProjectItemProps) => {
  const navigate = useNavigate()
  const { id, name, image, status, floorPrice, itemTotalNum, communityId, tasks, publicSaleTime, chainId } = data
  // const {} = {
  //   ...defaultViewConfig,
  //   ...viewConfig,
  // }

  const statusLabel = ProjectStatusLabels[status] || 'Unknown ExploreProject Status'
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
      projectDescBottomText = `items ${itemTotalNum} . Floor Price ${floorPrice}`
      break
    case ProjectStatus.FUTURE:
      // 预发售日期
      const publicMintStartDate = new Date(publicSaleTime).toLocaleDateString()
      projectDescBottomText = `items ${itemTotalNum} . Mint Price ${floorPrice} ${publicMintStartDate}`
  }
  return (
    <ExploreProjectItemWrapper onClick={() => navigate(`/community/${communityId}?projectId=${id}`)}>
      <ProjectImageBox>
        <ChainTag size={1} chainId={chainId} />
        <ProjectImage src={image} />
      </ProjectImageBox>

      <ProjectInfoBox>
        <ProjectInfoTopBox>
          <ProjectName>{name}</ProjectName>
          <ProjectStatusLabel>
            <ProjectStatusLabelLeft />
            {statusLabel}
          </ProjectStatusLabel>
        </ProjectInfoTopBox>
        <ProjectInfoBottomBox>{projectDescBottomText}</ProjectInfoBottomBox>
      </ProjectInfoBox>
    </ExploreProjectItemWrapper>
  )
}
export default ExploreProjectItem
const ExploreProjectItemWrapper = styled.div`
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
const ProjectImageBox = styled.div`
  position: relative;
`
const ProjectImage = styled.img`
  width: 100%;
  height: 206px;
`
const ProjectInfoBox = styled.div`
  flex: 1;
  padding-top: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  ${ScrollBarCss}
`
// top
const ProjectInfoTopBox = styled.div`
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
const ProjectInfoBottomBox = styled.div`
  font-size: 14px;
`
