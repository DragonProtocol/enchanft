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
    const whitelistStartTimeText = new Date(whitelist.mintStartTime).toLocaleString()
    const whitelistMintPriceText = whitelist.mintPrice ? `Mint Price ${whitelist.mintPrice}` : 'Free Mint'
    return (
      <ProjectMintInfoBox>
        <ProjectMintInfoTopBox>
          <ProjectMintInfoLabel>Whitelist</ProjectMintInfoLabel>
          <ProjectMintInfoStartsInText>Starts in</ProjectMintInfoStartsInText>
          <ProjectMintInfoStartsInTime>{whitelistStartTimeText}</ProjectMintInfoStartsInTime>
        </ProjectMintInfoTopBox>
        <PrjectMintInfoBottomBox>
          MAX {whitelist.mintMaxNum} Tokens . {whitelistMintPriceText}
        </PrjectMintInfoBottomBox>
      </ProjectMintInfoBox>
    )
  }
  const publicSaleTimeText = new Date(publicSaleTime).toLocaleString()
  return (
    <ProjectDetailBasicInfoWrapper>
      <ProjectTopBox>
        <ProjectTopLeftBox>
          <ChainTag size={1.5} chainId={chainId} />
          <ProjectImage src={image} />
        </ProjectTopLeftBox>
        {/* project basic info */}
        <ProjectTopCenterBox>
          <ProjectName>{name}</ProjectName>
          <PorjectNumbersBox>
            <ProjectItems>items {itemTotalNum || 0}</ProjectItems>
            <ProjectEnchaNftSol>EnchaNFT {injectedCoins}</ProjectEnchaNftSol>
          </PorjectNumbersBox>
          <ProjectDescription value={description} />
          {displayMintInfo && (
            <>
              {renderWhitelist()}
              <ProjectMintInfoBox>
                <ProjectMintInfoTopBox>
                  <ProjectMintInfoLabel>Public</ProjectMintInfoLabel>
                  <ProjectMintInfoStartsInText>Starts in</ProjectMintInfoStartsInText>
                  <ProjectMintInfoStartsInTime>{publicSaleTimeText}</ProjectMintInfoStartsInTime>
                </ProjectMintInfoTopBox>
                <PrjectMintInfoBottomBox>MAX 1 Tokens . Mint Price {publicSalePrice}</PrjectMintInfoBottomBox>
              </ProjectMintInfoBox>
            </>
          )}
        </ProjectTopCenterBox>
      </ProjectTopBox>
    </ProjectDetailBasicInfoWrapper>
  )
}
export default ProjectDetailBasicInfo
const ProjectDetailBasicInfoWrapper = styled.div`
  width: 100%;
`

const ProjectTopBox = styled.div`
  width: 100%;
  height: 410px;
  display: flex;
  gap: 20px;
`
const ProjectTopLeftBox = styled.div`
  flex: 1;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
`
const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
`
const ProjectTopCenterBox = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  ${ScrollBarCss}
`
const ProjectName = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  font-weight: bold;
`
const PorjectNumbersBox = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 23px;
`
const ProjectLinkIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`
const ProjectItems = styled.div`
  width: 120px;
  height: 30px;
  border-radius: 4px;
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  text-align: center;
`
const ProjectEnchaNftSol = styled.div`
  width: 120px;
  height: 30px;
  border-radius: 4px;
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  text-align: center;
`
const ProjectDescription = styled(RichTextBox)`
  flex: 1;
  overflow-y: auto;
  ${ScrollBarCss}
`
const ProjectMintInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: dashed 1px rgba(16, 16, 16, 100);
  padding-top: 20px;
  margin-top: 10px;
`
const ProjectMintInfoTopBox = styled.div`
  display: flex;
  justify-content: space-between;
`
const ProjectMintInfoLabel = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 16px;
  font-weight: bold;
`
const ProjectMintInfoStartsInText = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 16px;
`
const ProjectMintInfoStartsInTime = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 16px;
`
const PrjectMintInfoBottomBox = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
`
