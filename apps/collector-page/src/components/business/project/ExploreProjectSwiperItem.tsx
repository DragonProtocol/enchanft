/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-02 16:42:26
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { ProjectStatus } from '../../../types/api'
import RichTextBox from '../../common/text/RichTextBox'
import ChainTag from '../chain/ChainTag'
import ProjectStatusLabel from './ProjectStatusLabel'

export type ExploreProjectSwiperItemDataType = {
  id: number
  name: string
  image: string
  status: ProjectStatus
  description: string
  chainId: number
  communityId: number
  slug: string
}
export type ExploreProjectSwiperItemViewConfigType = {}

export type ExploreProjectSwiperItemDataViewType = {
  data: ExploreProjectSwiperItemDataType
  viewConfig?: ExploreProjectSwiperItemViewConfigType
}
export type ExploreProjectSwiperItemHandlesType = {}

export type ExploreProjectSwiperItemProps = ExploreProjectSwiperItemDataViewType & ExploreProjectSwiperItemHandlesType

const ExploreProjectSwiperItem: React.FC<ExploreProjectSwiperItemProps> = ({
  data,
  viewConfig,
}: ExploreProjectSwiperItemProps) => {
  const navigate = useNavigate()
  const { id, name, image, status, description, chainId, communityId, slug } = data
  return (
    <ExploreProjectSwiperItemWrapper>
      {/* <ChainTag size={2} chainId={chainId} /> */}
      <ProjectImage src={image} onClick={() => navigate(`/${slug}`)} />
      <ProjectInfoBox>
        <ProjectName>{name}</ProjectName>
        <ProjectStatusLabel status={status} fontSize="20px" />
        <ProjectDescription value={description} />
      </ProjectInfoBox>
    </ExploreProjectSwiperItemWrapper>
  )
}
export default ExploreProjectSwiperItem
const ExploreProjectSwiperItemWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`
const ProjectImage = styled.img`
  width: 360px;
  height: 360px;
  cursor: pointer;
  /* 图片不失真，不会出现拉伸 */
  object-fit: cover;
`
const ProjectInfoBox = styled.div`
  flex: 1;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const ProjectName = styled.div`
  font-weight: 700;
  font-size: 36px;
  line-height: 54px;
  color: #333333;
`
const ProjectDescription = styled(RichTextBox)`
  flex: 1;
  overflow-y: auto;
  ${ScrollBarCss}
`
