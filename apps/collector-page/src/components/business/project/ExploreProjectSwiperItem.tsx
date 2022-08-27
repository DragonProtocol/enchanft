/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-26 14:16:53
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { MintStage } from '../../../types/entities'
import ScrollBox from '../../common/scroll/ScrollBox'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import RichTextBox from '../../common/text/RichTextBox'
import RichTextToPlainTextSpan from '../../common/text/RichTextToPlainTextSpan'
import ChainTag from '../chain/ChainTag'
import MintStageLabel from './MintStageLabel'

export type ExploreProjectSwiperItemDataType = {
  id: number
  name: string
  image: string
  mintStage: MintStage
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
  const { id, name, image, mintStage, description, chainId, communityId, slug } = data
  return (
    <ExploreProjectSwiperItemWrapper>
      {/* <ChainTag size={2} chainId={chainId} /> */}
      <ProjectImageBox>
        <ProjectImage src={image} onClick={() => navigate(`/${slug}`)} />
      </ProjectImageBox>

      <ProjectInfoBox>
        <ProjectName>{name}</ProjectName>
        <MintStageLabel mintStage={mintStage} fontSize="20px" />
        {/* <ProjectDescription number={9}>
          <RichTextToPlainTextSpan value={description} />
        </ProjectDescription> */}
        <ProjectDescription barSize="sm">
          <RichTextBox value={description} />
        </ProjectDescription>
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
const ProjectImageBox = styled.div`
  width: 360px;
  height: 360px;
  overflow: hidden;
  flex-shrink: 0;
`
const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  cursor: pointer;
  /* 图片不失真，不会出现拉伸 */
  object-fit: cover;
  /* 鼠标移入时, 放大图片10%, 0.5s完成 */
  &:hover {
    transform: scale(1.1);
  }
  /** 鼠标点下，下沉2px */
  &:active {
    transform: translateY(2px);
  }
  transition: all 0.5s ease-out;
`
const ProjectInfoBox = styled.div`
  flex: 1;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const ProjectName = styled.div`
  font-weight: 700;
  font-size: 36px;
  line-height: 54px;
  color: #333333;
`

// const ProjectDescription = styled(OverflowEllipsisBox)`
//   flex: 1;
//   font-size: 16px;
//   line-height: 20px;
//   color: rgba(51, 51, 51, 0.6);
// `
const ProjectDescription = styled(ScrollBox)`
  flex: 1;
`
