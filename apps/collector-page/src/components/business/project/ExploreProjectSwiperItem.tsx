/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 16:56:55
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { ProjectStatus } from '../../../types/api'

export type ExploreProjectSwiperItemDataType = {
  id: number
  name: string
  image: string
  status: ProjectStatus
  description: string
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
  const { id, name, image, status, description } = data
  const statusLabel = ProjectStatusLabels[status] || 'Unknown Project Status'
  return (
    <ExploreProjectSwiperItemWrapper>
      <ProjectImage src={image} />
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
