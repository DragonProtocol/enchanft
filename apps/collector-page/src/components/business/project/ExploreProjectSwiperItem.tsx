/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-26 11:24:28
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { ProjectStatus } from '../../../types/api'
import ChainTag from '../chain/ChainTag'

export type ExploreProjectSwiperItemDataType = {
  id: number
  name: string
  image: string
  status: ProjectStatus
  description: string
  chainId: number
  communityId: number
}
export type ExploreProjectSwiperItemViewConfigType = {}

export type ExploreProjectSwiperItemDataViewType = {
  data: ExploreProjectSwiperItemDataType
  viewConfig?: ExploreProjectSwiperItemViewConfigType
}
export type ExploreProjectSwiperItemHandlesType = {}

export type ExploreProjectSwiperItemProps = ExploreProjectSwiperItemDataViewType & ExploreProjectSwiperItemHandlesType

const ProjectStatusLabels = {
  [ProjectStatus.ACTIVE]: 'Active',
  [ProjectStatus.LIVE]: 'Live',
  [ProjectStatus.FUTURE]: 'Future',
}

const ExploreProjectSwiperItem: React.FC<ExploreProjectSwiperItemProps> = ({
  data,
  viewConfig,
}: ExploreProjectSwiperItemProps) => {
  const navigate = useNavigate()
  const { id, name, image, status, description, chainId, communityId } = data
  const statusLabel = ProjectStatusLabels[status] || 'Unknown Project Status'
  return (
    <ExploreProjectSwiperItemWrapper>
      <ChainTag size={2} chainId={chainId} />
      <ProjectImage src={image} onClick={() => navigate(`/community/${communityId}?projectId=${id}`)} />
      <ProjectInfoBox>
        <ProjectName>{name}</ProjectName>
        <ProjectStatusLabel>{statusLabel}</ProjectStatusLabel>
        <ProjectDescription>{description}</ProjectDescription>
      </ProjectInfoBox>
    </ExploreProjectSwiperItemWrapper>
  )
}
export default ExploreProjectSwiperItem
const ExploreProjectSwiperItemWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 40px;
`
const ProjectImage = styled.img`
  width: 360px;
  height: 100%;
  cursor: pointer;
`
const ProjectInfoBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const ProjectName = styled.div`
  font-size: 36px;
  line-height: 40px;
  color: #333333;
`
const ProjectStatusLabel = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #3dd606;
`
const ProjectDescription = styled.div`
  flex: 1;
  font-size: 16px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.6);
  overflow-y: auto;
  ${ScrollBarCss}
`
