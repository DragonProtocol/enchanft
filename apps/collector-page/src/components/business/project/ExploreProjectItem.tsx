/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:52:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-17 18:55:42
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { ProjectStatus, TaskType } from '../../../types/entities'
import CardItemBox from '../../common/card/CardItemBox'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import ChainTag from '../chain/ChainTag'
import ProjectStatusLabel from './ProjectStatusLabel'

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
  slug: string
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

const ExploreProjectItem: React.FC<ExploreProjectItemProps> = ({ data, viewConfig }: ExploreProjectItemProps) => {
  const navigate = useNavigate()
  const { id, name, image, status, floorPrice, itemTotalNum, communityId, tasks, publicSaleTime, chainId, slug } = data
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
      projectDescBottomText = `${tasks.length} task . ${days} days`
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
    <ExploreProjectItemWrapper onClick={() => navigate(`/${slug}`)}>
      <ProjectImageBox>
        <ChainTag size={1} chainId={chainId} />
        <ProjectImage src={image} />
      </ProjectImageBox>

      <ProjectInfoBox>
        <ProjectName>{name}</ProjectName>
        <ProjectStatusLabel status={status} />
        <ProjectInfoBottomBox>{projectDescBottomText}</ProjectInfoBottomBox>
      </ProjectInfoBox>
    </ExploreProjectItemWrapper>
  )
}
export default ExploreProjectItem
const ExploreProjectItemWrapper = styled(CardItemBox)`
  height: 394px;
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
  height: 275px;
  /* 图片不失真，不会出现拉伸 */
  object-fit: cover;
`
const ProjectInfoBox = styled.div`
  flex: 1;
  padding: 10px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  ${ScrollBarCss}
`
const ProjectName = styled(OverflowEllipsisBox)`
  font-weight: 700;
  font-size: 18px;
  color: #333333;
  flex-shrink: 0;
`
// bottom
const ProjectInfoBottomBox = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(51, 51, 51, 0.6);
`
