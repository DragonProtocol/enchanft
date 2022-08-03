import React, { useState } from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { ProjectStatus, TaskType, Whitelist } from '../../../types/api'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'
import TaskContent, { TaskContentDataViewType, TaskContentHandlesType } from '../task/TaskContent'
import ProjectRoadmap, { ProjectRoadmapItemDataType } from './ProjectRoadmap'
import { ProjectTeamMemberItemDataViewType } from './ProjectTeamMemberItem'
import ProjectTeamMemberList from './ProjectTeamMemberList'
import WebsiteIcon from '../../imgs/internet.svg'
import TwitterIcon from '../../imgs/twitter.svg'
import ProjectTaskSwiper from './ProjectTaskSwiper'
import RichTextBox from '../../common/text/RichTextBox'
import ChainTag from '../chain/ChainTag'
import TimeCountdown from '../../common/time/TimeCountdown'
export type ProjectDetailBasicInfoDataType = {
  id: number
  name: string
  description: string
  status: ProjectStatus
  image: string
  itemTotalNum: number
  publicSaleTime: number
  publicSalePrice: string
  injectedCoins: number
  chainId: number
  whitelists: Whitelist[]
}

export type ProjectDetailBasicInfoViewConfigType = {
  displayMintInfo: boolean
  displayTasks: boolean
}

export type ProjectDetailBasicInfoDataViewType = {
  data: ProjectDetailBasicInfoDataType
  viewConfig?: ProjectDetailBasicInfoViewConfigType
}

export type ProjectDetailBasicInfoProps = ProjectDetailBasicInfoDataViewType & TaskContentHandlesType

const defaultViewConfig = {
  displayMintInfo: true,
}
const ProjectDetailBasicInfo: React.FC<ProjectDetailBasicInfoProps> = ({
  data,
  viewConfig,
  onTake,
}: ProjectDetailBasicInfoProps) => {
  const {
    id,
    name,
    description,
    status,
    image,
    itemTotalNum,
    publicSaleTime,
    publicSalePrice,
    injectedCoins,
    chainId,
    whitelists,
  } = data
  const { displayMintInfo } = {
    ...defaultViewConfig,
    ...viewConfig,
  }

  const renderWhitelist = () => {
    const whitelist = whitelists[0]
    if (!whitelist) {
      return null
    }
    const whitelistMintPriceText = whitelist.mintPrice ? `Mint Price ${whitelist.mintPrice}` : 'Free Mint'
    return (
      <>
        <ProjectMintInfoBox>
          <ProjectMintInfoLabel>Whitelist</ProjectMintInfoLabel>
          <ProjectMintInfoStartsInTextBox>
            {whitelist.mintStartTime < new Date().getTime() ? (
              <ProjectMintInfoStartsInText>Already Start</ProjectMintInfoStartsInText>
            ) : (
              <>
                <ProjectMintInfoStartsInText>Starts in</ProjectMintInfoStartsInText>
                <TimeCountdown timestamp={whitelist.mintStartTime} />
              </>
            )}
          </ProjectMintInfoStartsInTextBox>
          <PrjectMintInfoPriceText>
            MAX {whitelist.mintMaxNum} Tokens . {whitelistMintPriceText}
          </PrjectMintInfoPriceText>
        </ProjectMintInfoBox>
        <HorizontalLine />
      </>
    )
  }
  return (
    <ProjectDetailBasicInfoWrapper>
      <ProjectTopBox>
        <ProjectImage src={image} />
        {/* project basic info */}
        <ProjectTopRightBox>
          <ProjectName>{name}</ProjectName>
          <PorjectNumbersBox>
            <PorjectNumbersItemBox>
              <ProjectNumbersItemLabel>items</ProjectNumbersItemLabel>
              <ProjectNumbersItemValue>{itemTotalNum || 0}</ProjectNumbersItemValue>
            </PorjectNumbersItemBox>
            <PorjectNumbersItemBox>
              <ProjectNumbersItemLabel>EnchaNFT</ProjectNumbersItemLabel>
              <ProjectNumbersItemValue>{injectedCoins || 0}</ProjectNumbersItemValue>
            </PorjectNumbersItemBox>
          </PorjectNumbersBox>
          <ProjectDescription value={description} />
        </ProjectTopRightBox>
      </ProjectTopBox>
      {displayMintInfo && (
        <ProjectBottomBox>
          {renderWhitelist()}
          <ProjectMintInfoBox>
            <ProjectMintInfoLabel>Public</ProjectMintInfoLabel>
            <ProjectMintInfoStartsInTextBox>
              {publicSaleTime < new Date().getTime() ? (
                <ProjectMintInfoStartsInText>Already Start</ProjectMintInfoStartsInText>
              ) : (
                <>
                  <ProjectMintInfoStartsInText>Starts in</ProjectMintInfoStartsInText>
                  <TimeCountdown timestamp={publicSaleTime} />
                </>
              )}
            </ProjectMintInfoStartsInTextBox>
            <PrjectMintInfoPriceText>MAX 1 Tokens . Mint Price {publicSalePrice}</PrjectMintInfoPriceText>
          </ProjectMintInfoBox>
        </ProjectBottomBox>
      )}
    </ProjectDetailBasicInfoWrapper>
  )
}
export default ProjectDetailBasicInfo
const ProjectDetailBasicInfoWrapper = styled.div`
  width: 100%;
`

const ProjectTopBox = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
`
const ProjectImage = styled.img`
  width: 230px;
  height: 230px;
  object-fit: cover;
`
const ProjectTopRightBox = styled.div`
  flex: 1;
  height: 230px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`
const ProjectName = styled.div`
  font-weight: 700;
  font-size: 24px;
  color: #333333;
`
const PorjectNumbersBox = styled.div`
  display: flex;
  gap: 10px;
`
const PorjectNumbersItemBox = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 12px;
  width: 190px;
  height: 40px;
  border: 2px solid #333333;
`
const ProjectNumbersItemLabel = styled.span`
  font-size: 16px;
  color: rgba(51, 51, 51, 0.6);
`
const ProjectNumbersItemValue = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: #333333;
`
const ProjectDescription = styled(RichTextBox)`
  flex: 1;
  overflow-y: auto;
  ${ScrollBarCss}
`
const ProjectBottomBox = styled.div`
  margin-top: 15px;
  width: 100%;
  height: 168px;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 30px 20px;
  box-sizing: border-box;
  justify-content: space-around;
`
const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background: #d9d9d9;
`

const ProjectMintInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ProjectMintInfoLabel = styled.div`
  flex: 1;
  font-weight: 700;
  font-size: 16px;
  color: #333333;
`
const ProjectMintInfoStartsInTextBox = styled.div`
  flex: 1;
  display: flex;
  gap: 10px;
  align-items: center;
`
const ProjectMintInfoStartsInText = styled.div`
  font-size: 14px;
  color: rgba(51, 51, 51, 0.6);
`
const PrjectMintInfoPriceText = styled.div`
  flex: 1;
  font-weight: 700;
  font-size: 14px;
  color: #333333;
`
