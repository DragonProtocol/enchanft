/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:52:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-09 11:21:35
 * @Description: file description
 */
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { MintStage, ProjectStatus, TaskType } from '../../../types/entities'
import CardItemBox, { CardItemBoxAnimationType } from '../../common/card/CardItemBox'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import ChainTag from '../chain/ChainTag'
import MintStageLabel from './MintStageLabel'

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
  publicSaleTime: number
  publicSalePrice: string
  communityId: number
  chainId: number
  slug: string
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
    publicSaleTime,
    chainId,
    slug,
  } = data
  // const {} = {
  //   ...defaultViewConfig,
  //   ...viewConfig,
  // }

  let projectDescBottomText = ''
  if (itemTotalNum) {
    projectDescBottomText = `items ${itemTotalNum}`
  }
  switch (mintStage) {
    case MintStage.FUTURE:
      if (publicSalePrice) {
        projectDescBottomText += ` . Mint Price ${publicSalePrice}`
      }
      if (publicSaleTime) {
        // 预发售日期
        const publicMintStartDate = new Date(publicSaleTime).toLocaleDateString()
        projectDescBottomText += ` . ${publicMintStartDate}`
      }
      break
    case MintStage.LIVE:
      if (publicSalePrice) {
        projectDescBottomText += ` . Mint Price ${publicSalePrice}`
      }
      break
  }
  return (
    <ExploreProjectItemWrapper
      onClick={() => navigate(`/${slug}`)}
      animationType={CardItemBoxAnimationType.HOVER_MOVE_UP}
    >
      <ProjectImageBox>
        <ChainTag size={1} chainId={chainId} />
        <ProjectImage src={image} />
      </ProjectImageBox>

      <ProjectInfoBox>
        <ProjectName>{name}</ProjectName>
        <ProjectTimeRow>
          <MintStageLabel mintStage={mintStage} />
          {mintStage === MintStage.FUTURE && publicSaleTime && (
            <ProjectTimeText>{new Date(publicSaleTime).toLocaleDateString()}</ProjectTimeText>
          )}
        </ProjectTimeRow>

        <ProjectInfoBottomBox>
          {itemTotalNum !== undefined && (
            <>
              <ProjectInfoBottomText>Items {itemTotalNum}</ProjectInfoBottomText>
              <ProjectInfoBottomText>|</ProjectInfoBottomText>
            </>
          )}
          {publicSalePrice && <ProjectInfoBottomText>Mint Price {publicSalePrice}</ProjectInfoBottomText>}
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
`
const ProjectImageBox = styled.div`
  height: 275px;
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
