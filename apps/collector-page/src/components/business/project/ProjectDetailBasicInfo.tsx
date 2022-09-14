import React, { useState } from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { ProjectStatus, TaskType, Whitelist } from '../../../types/entities'
import TaskContent, { TaskContentDataViewType, TaskContentHandlesType } from '../task/TaskContent'
import RichTextBox from '../../common/text/RichTextBox'
import TimeCountdown from '../../common/time/TimeCountdown'
import { MOBILE_BREAK_POINT } from '../../../constants'
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
  return (
    <ProjectDetailBasicInfoWrapper>
      {/* <ProjectName>{name}</ProjectName> */}
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
            {publicSalePrice && (
              <PrjectMintInfoPriceText>MAX 1 Tokens . Mint Price {publicSalePrice}</PrjectMintInfoPriceText>
            )}
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
  gap: 10px;
`
const MintTimeCountdown = styled(TimeCountdown)`
  margin-left: 10px;
`
const ProjectName = styled.div`
  font-weight: 700;
  font-size: 28px;
  line-height: 42px;
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
  width: 185px;
  height: 40px;
  background: #ebeee4;
  border-radius: 10px;
`
const ProjectNumbersItemLabel = styled.span`
  font-size: 16px;
  color: rgba(51, 51, 51, 0.6);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
  }
`
const ProjectNumbersItemValue = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 14px;
    line-height: 21px;
  }
`
const ProjectDescription = styled(RichTextBox)`
  max-height: 120px;
  overflow-y: auto;
  ${ScrollBarCss}
  padding-bottom: 10px;
  border-bottom: 1px solid #d9d9d9;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.6);
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
    line-height: 18px;
  }
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
