/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:52:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-28 12:35:08
 * @Description: file description
 */
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { MOBILE_BREAK_POINT } from '../../../constants'
import { ScrollBarCss } from '../../../GlobalStyle'
import { GradeType, MintStage, ProjectStatus, TaskType } from '../../../types/entities'
import { formatNumberToUnitString } from '../../../utils/number'
import { formatDateTime } from '../../../utils/time'
import CardItemBox, { CardItemBoxAnimationType } from '../../common/card/CardItemBox'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import ChainTag from '../chain/ChainTag'
import MintStageLabel from './MintStageLabel'
import ProjectGradeTag from './ProjectGradeTag'

export type ExploreProjectIndexItemDataType = {
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
  community?: {
    memberNum?: number
  }
}

export type ExploreProjectIndexItemViewConfigType = {}

export type ExploreProjectIndexItemDataViewType = {
  data: ExploreProjectIndexItemDataType
  viewConfig?: ExploreProjectIndexItemViewConfigType
}

export type ExploreProjectIndexItemProps = ExploreProjectIndexItemDataViewType

const defaultViewConfig = {}

const ExploreProjectIndexItem: React.FC<ExploreProjectIndexItemProps> = ({
  data,
  viewConfig,
}: ExploreProjectIndexItemProps) => {
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
    community,
    grade,
  } = data
  // const {} = {
  //   ...defaultViewConfig,
  //   ...viewConfig,
  // }
  return (
    <ExploreProjectIndexItemWrapper
      onClick={() => navigate(`/${slug}`)}
      animationType={CardItemBoxAnimationType.HOVER_MOVE_UP}
    >
      <ProjectGradeTag grade={grade} />
      <ProjectImage src={image} />

      <ProjectInfoBox>
        <ProjectName>{name}</ProjectName>

        <ProjectNumbersBox>
          <ProjectNumbersColumn>
            <ProjectNumberValue>{formatNumberToUnitString(community?.memberNum || 0)}</ProjectNumberValue>
            <ProjectNumberLabel>members</ProjectNumberLabel>
          </ProjectNumbersColumn>
          <ProjectNumbersColumn>
            <ProjectNumberValue>{tasks?.length || 0}</ProjectNumberValue>
            <ProjectNumberLabel>events</ProjectNumberLabel>
          </ProjectNumbersColumn>
        </ProjectNumbersBox>
      </ProjectInfoBox>
    </ExploreProjectIndexItemWrapper>
  )
}
export default ExploreProjectIndexItem
const ExploreProjectIndexItemWrapper = styled(CardItemBox)`
  height: 140px;
  padding: 20px;
  display: flex;
  gap: 20px;
  cursor: pointer;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  position: relative;
`
const ProjectImage = styled.img`
  width: 100px;
  border-radius: 10px;
  /* 图片不失真，不会出现拉伸 */
  object-fit: cover;
`
const ProjectInfoBox = styled.div`
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  ${ScrollBarCss}
`
const ProjectName = styled(OverflowEllipsisBox)`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
  flex-shrink: 0;
`
// bottom
const ProjectNumbersBox = styled.div`
  display: flex;
  justify-content: space-between;
`
const ProjectNumbersColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`
const ProjectNumberValue = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`
const ProjectNumberLabel = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: rgba(51, 51, 51, 0.6);
`
