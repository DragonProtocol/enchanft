/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:52:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-27 16:37:34
 * @Description: file description
 */
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { MOBILE_BREAK_POINT } from '../../../constants'
import { ScrollBarCss } from '../../../GlobalStyle'
import { GradeType, MintStage, ProjectStatus, TaskType } from '../../../types/entities'
import { formatDateTime } from '../../../utils/time'
import CardItemBox, { CardItemBoxAnimationType } from '../../common/card/CardItemBox'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import ChainTag from '../chain/ChainTag'
import MintStageLabel from './MintStageLabel'
import ProjectGradeTag from './ProjectGradeTag'

export type ExploreProjectItemDataType = {
  id: number
  name: string
  image: string
  status: ProjectStatus
  floorPrice: string
  injectedCoins: number
  itemTotalNum: number
  mintStage: MintStage
  mintStartTime: number
  publicSaleStartTime: number
  publicSalePrice: string
  communityId: number
  chainId: number
  slug: string
  grade: GradeType
  tasks?: Array<{
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

const ExploreProjectItem: React.FC<ExploreProjectItemProps> = ({ data, viewConfig }: ExploreProjectItemProps) => {
  const navigate = useNavigate()
  const {
    id,
    name,
    image,
    mintStage,
    publicSalePrice,
    itemTotalNum,
    communityId,
    tasks,
    publicSaleStartTime,
    chainId,
    slug,
    grade,
  } = data
  // const {} = {
  //   ...defaultViewConfig,
  //   ...viewConfig,
  // }
  return (
    <ExploreProjectItemWrapper
      onClick={() => navigate(`/${slug}`)}
      animationType={CardItemBoxAnimationType.HOVER_MOVE_UP}
    >
      <ProjectGradeTag grade={grade} />
      <ProjectImageBox>
        <ChainTag size={1} chainId={chainId} />
        <ProjectImage src={image} />
      </ProjectImageBox>

      <ProjectInfoBox>
        <ProjectName>{name}</ProjectName>
        <ProjectTimeRow>
          <ProjectMintStageLabel mintStage={mintStage} />
          {mintStage === MintStage.FUTURE && publicSaleStartTime && (
            <ProjectTimeText>{formatDateTime(publicSaleStartTime)}</ProjectTimeText>
          )}
        </ProjectTimeRow>

        <ProjectInfoBottomBox>
          {itemTotalNum !== undefined && <ProjectInfoBottomText>Items {itemTotalNum}</ProjectInfoBottomText>}
          {itemTotalNum !== undefined && !!publicSalePrice && <ProjectInfoBottomText>|</ProjectInfoBottomText>}
          {!!publicSalePrice && <ProjectInfoBottomText>Mint Price {publicSalePrice}</ProjectInfoBottomText>}
        </ProjectInfoBottomBox>
      </ProjectInfoBox>
    </ExploreProjectItemWrapper>
  )
}
export default ExploreProjectItem
const ExploreProjectItemWrapper = styled(CardItemBox)`
  height: 402px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    height: 422px;
  }
`
const ProjectImageBox = styled.div`
  height: 275px;
  position: relative;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    height: 295px;
  }
`
const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  /* 图片不失真，不会出现拉伸 */
  object-fit: cover;
`
const ProjectInfoBox = styled.div`
  flex: 1;
  padding: 20px;
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
  line-height: 25px;
  color: #333333;
  flex-shrink: 0;
`
const ProjectMintStageLabel = styled(MintStageLabel)`
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
  }
`
const ProjectTimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ProjectTimeText = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  color: #333333;
`
// bottom
const ProjectInfoBottomBox = styled.div`
  border-top: 1px dashed rgba(51, 51, 51, 0.3);
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ProjectInfoBottomText = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: rgba(51, 51, 51, 0.6);
`
