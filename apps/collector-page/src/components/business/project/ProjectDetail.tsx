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
export type ProjectDetailDataType = {
  id: number
  name: string
  description: string
  story: string
  status: ProjectStatus
  image: string
  communityId: number
  itemTotalNum: number
  mintPrice: string
  mintStartTime: number
  whitelistTotalNum: number
  publicSaleTime: number
  publicSalePrice: string
  injectedCoins: number
  discord: string
  twitter: string
  chainId: number
  tasks: TaskContentDataViewType[]
  teamMembers: ProjectTeamMemberItemDataViewType[]
  roadmap: ProjectRoadmapItemDataType[]
  whitelists: Whitelist[]
}

export type ProjectDetailViewConfigType = {
  displayMintInfo: boolean
  displayTasks: boolean
}

export type ProjectDetailDataViewType = {
  data: ProjectDetailDataType
  viewConfig?: ProjectDetailViewConfigType
}

export type ProjectDetailProps = ProjectDetailDataViewType & TaskContentHandlesType

const defaultViewConfig = {
  displayMintInfo: true,
  displayTasks: true,
}
const ProjectDetail: React.FC<ProjectDetailProps> = ({ data, viewConfig, onTake }: ProjectDetailProps) => {
  const {
    id,
    name,
    description,
    story,
    status,
    image,
    itemTotalNum,
    mintPrice,
    mintStartTime,
    whitelistTotalNum,
    publicSaleTime,
    publicSalePrice,
    injectedCoins,
    discord,
    twitter,
    chainId,
    tasks,
    teamMembers,
    roadmap,
    whitelists,
  } = data
  const { displayMintInfo, displayTasks } = {
    ...defaultViewConfig,
    ...viewConfig,
  }

  const ProjectInfoTabs = [
    {
      label: 'Meet the Team',
      value: 'meetTheTeam',
      component: <ProjectTeamMemberList items={teamMembers} />,
    },
    {
      label: 'Roadmap',
      value: 'roadmap',
      component: <ProjectRoadmap items={roadmap} />,
    },
    {
      label: 'Reviews',
      value: 'reviews',
      component: <span>Not yet developed</span>,
    },
  ]
  const [activeTab, setActiveTab] = useState(ProjectInfoTabs[0])
  const whitelist = whitelists[0]
  const whitelistStartTimeText = new Date(whitelist.mintStartTime).toLocaleString()
  const whitelistMintPriceText = whitelist.mintPrice ? `Mint Price ${whitelist.mintPrice}` : 'Free Mint'
  const publicSaleTimeText = new Date(publicSaleTime).toLocaleString()
  return (
    <ProjectDetailWrapper>
      <ProjectTopBox>
        <ProjectTopLeftBox>
          <ChainTag size={1.5} chainId={chainId} />
          <ProjectImage src={image} />
        </ProjectTopLeftBox>
        {/* project basic info */}
        <ProjectTopCenterBox>
          <ProjectName>{name}</ProjectName>
          <PorjectLinksBox>
            <a href={discord} target="_blank" rel="noopener noreferrer">
              <ProjectLinkIcon src={WebsiteIcon} />
            </a>
            <a href={twitter} target="_blank" rel="noopener noreferrer">
              <ProjectLinkIcon src={TwitterIcon} />
            </a>
            <ProjectItems>items {itemTotalNum || 0}</ProjectItems>
            <ProjectEnchaNftSol>EnchaNFT {injectedCoins}</ProjectEnchaNftSol>
          </PorjectLinksBox>
          <ProjectDescription value={description} />
          {displayMintInfo && (
            <>
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
        {/* tasks */}
        <ProjectTopRightBox>
          {displayTasks && (
            <ProjectTasksBox>
              <ProjectTaskSwiper items={tasks} onTake={onTake}></ProjectTaskSwiper>
            </ProjectTasksBox>
          )}
        </ProjectTopRightBox>
      </ProjectTopBox>
      <ProjectBottomBox>
        <ProjectBottomLeftBox>
          <ProjectStoryLabel>Story</ProjectStoryLabel>
          <ProjectStoryContent value={story} />
        </ProjectBottomLeftBox>
        <ProjectBottomRightBox>
          <ProjectBottomRightTabs>
            {ProjectInfoTabs.map((tab) => (
              <ProjectBottomRightTab
                key={tab.value}
                isActive={tab.value === activeTab.value}
                onClick={() => setActiveTab(tab)}
              >
                {tab.label}
              </ProjectBottomRightTab>
            ))}
          </ProjectBottomRightTabs>
          {activeTab.component}
        </ProjectBottomRightBox>
      </ProjectBottomBox>
    </ProjectDetailWrapper>
  )
}
export default ProjectDetail
const ProjectDetailWrapper = styled.div`
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
const PorjectLinksBox = styled.div`
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

const ProjectTopRightBox = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
`
const ProjectTasksBox = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 2px solid rgba(21, 21, 21, 100);
  box-sizing: border-box;
  padding: 16px 39px;
  overflow: hidden;
`

const ProjectBottomBox = styled.div`
  margin-top: 50px;
  display: flex;
  gap: 60px;
`
const ProjectBottomLeftBox = styled.div`
  flex: 1;
`
const ProjectStoryLabel = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`
const ProjectStoryContent = styled(RichTextBox)``
const ProjectBottomRightBox = styled.div`
  flex: 1;
`
const ProjectBottomRightTabs = styled.div`
  display: flex;
  gap: 80px;
  margin-bottom: 20px;
`
const ProjectBottomRightTab = styled.div<{ isActive: Boolean }>`
  color: rgba(0, 0, 0, 1);
  font-size: 18px;
  ${({ isActive }) => (isActive ? `box-shadow: inset 0 -1px rgba(0, 0, 0, 1);` : '')}
  cursor: pointer;
  padding-bottom: 10px;
`
