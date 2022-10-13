import React, { useState } from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { Announcement, ProjectStatus, TaskType, Whitelist } from '../../../types/entities'
import TaskContent, { TaskContentDataViewType, TaskContentHandlesType } from '../task/TaskContent'
import RichTextBox from '../../common/text/RichTextBox'
import TimeCountdown from '../../common/time/TimeCountdown'
import { MOBILE_BREAK_POINT } from '../../../constants'
import { CollapsePanel } from '../../common/collapse'
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
  whitelists?: Whitelist[]
  announcement?: Announcement
  mintLimited: number
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
    announcement,
    mintLimited,
  } = data
  const { displayMintInfo } = {
    ...defaultViewConfig,
    ...viewConfig,
  }

  const renderWhitelist = () => {
    if (!whitelists || !whitelists.length) return null
    const whitelist = whitelists[0]
    if (!whitelist) return
    const whitelistMintPriceText = whitelist.mintPrice ? `Mint Price ${whitelist.mintPrice}` : 'Free Mint'
    return (
      <>
        <ProjectMintInfoBox>
          <ProjectMintInfoBoxTop>
            <ProjectMintInfoLabel>Whitelist</ProjectMintInfoLabel>
            {whitelist.mintStartTime &&
              (whitelist.mintStartTime < new Date().getTime() ? (
                <ProjectMintInfoStartsInText>Already Start</ProjectMintInfoStartsInText>
              ) : (
                <>
                  <ProjectMintInfoStartsInText>Starts in</ProjectMintInfoStartsInText>
                  <MintTimeCountdown timestamp={whitelist.mintStartTime} />
                </>
              ))}
          </ProjectMintInfoBoxTop>

          <PrjectMintInfoPriceText>
            {whitelist?.mintMaxNum && 'MAX ' + whitelist.mintMaxNum + ' Tokens .'} {whitelistMintPriceText}
          </PrjectMintInfoPriceText>
        </ProjectMintInfoBox>
      </>
    )
  }
  const [collapsePanelDxpanded, setCollapsePanelDxpanded] = useState({
    description: true,
    announcement: true,
  })
  const switchCollapsePanelDxpanded = (key: string) =>
    setCollapsePanelDxpanded({ ...collapsePanelDxpanded, [`${key}`]: !collapsePanelDxpanded[key] })
  return (
    <ProjectDetailBasicInfoWrapper>
      {!!description && (
        <CollapsePanel
          header={<ProjectAnnouncementTitleBox>Description</ProjectAnnouncementTitleBox>}
          expanded={collapsePanelDxpanded.description}
          onClick={() => switchCollapsePanelDxpanded('description')}
        >
          <ProjectDescription value={description} />
        </CollapsePanel>
      )}
      {!!announcement && !!announcement.title && (
        <CollapsePanel
          header={
            <ProjectAnnouncementTitleBox>
              {announcement.title}
              <ProjectAnnouncementTitleTag>New</ProjectAnnouncementTitleTag>
            </ProjectAnnouncementTitleBox>
          }
          expanded={collapsePanelDxpanded.announcement}
          onClick={() => switchCollapsePanelDxpanded('announcement')}
        >
          <ProjectAnnouncement value={announcement.text} />
        </CollapsePanel>
      )}

      {displayMintInfo && (
        <>
          {renderWhitelist()}
          <ProjectMintInfoBox>
            <ProjectMintInfoBoxTop>
              <ProjectMintInfoLabel>Public</ProjectMintInfoLabel>
              {publicSaleTime &&
                (publicSaleTime < new Date().getTime() ? (
                  <ProjectMintInfoStartsInText>Already Start</ProjectMintInfoStartsInText>
                ) : (
                  <>
                    <ProjectMintInfoStartsInText>Starts in</ProjectMintInfoStartsInText>
                    <MintTimeCountdown timestamp={publicSaleTime} />
                  </>
                ))}
            </ProjectMintInfoBoxTop>
            <PrjectMintInfoPriceText>
              {mintLimited && `MAX ${mintLimited} Tokens .`}
              {publicSalePrice && `Mint Price ${publicSalePrice}`}
            </PrjectMintInfoPriceText>
          </ProjectMintInfoBox>
        </>
      )}
    </ProjectDetailBasicInfoWrapper>
  )
}
export default ProjectDetailBasicInfo
const ProjectDetailBasicInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #d9d9d9;
`
const MintTimeCountdown = styled(TimeCountdown)`
  margin-left: 10px;
`
const ProjectDescription = styled(RichTextBox)`
  max-height: 120px;
  overflow-y: auto;
  ${ScrollBarCss}

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.6);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
    line-height: 18px;
  }
`
const ProjectAnnouncement = styled(RichTextBox)`
  max-height: 120px;
  overflow-y: auto;
  ${ScrollBarCss}

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.6);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
    line-height: 18px;
  }
`
const ProjectAnnouncementTitleBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 14px;
    line-height: 21px;
  }
`
const ProjectAnnouncementTitleTag = styled.div`
  width: 49px;
  height: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #ffe793;
  border-radius: 10px;
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  text-transform: uppercase;
  color: #333333;
  margin-left: 10px;
`

const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background: #d9d9d9;
`

const ProjectMintInfoBox = styled.div`
  border-bottom: 1px solid #d9d9d9;
  padding: 20px 0;
  box-sizing: border-box;
`
const ProjectMintInfoBoxTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ProjectMintInfoLabel = styled.div`
  flex: 1;
  font-weight: 700;
  font-size: 16px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 14px;
    line-height: 21px;
  }
`
const ProjectMintInfoStartsInText = styled.div`
  font-size: 14px;
  color: rgba(51, 51, 51, 0.6);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
    line-height: 18px;
  }
`
const PrjectMintInfoPriceText = styled.div`
  height: 40px;
  background: #ebeee4;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
  margin-top: 10px;
`
