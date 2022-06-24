import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { MEDIA_BREAK_POINTS } from '../../utils/constants'
export type LaunchpadUpcomingItemDataType = {
  img: string
  name: string
  homeUrl: string
  twitterUrl: string
  discordUrl: string
  desc: string
  itemsNum: number
  price: number
  enchanfted: number
  projectParty: {
    name: string
  }
}
interface UpcomingListProps {
  data: LaunchpadUpcomingItemDataType[]
}
const UpcomingList: React.FC<UpcomingListProps> = ({ data }: UpcomingListProps) => {
  return (
    <UpcomingListWrapper>
      {data.map((item) => (
        <UpcomingListItem data={item} />
      ))}
    </UpcomingListWrapper>
  )
}

export default UpcomingList

/**
 * list style
 */
const UpcomingListWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 26px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.sm}px) and (max-width: ${MEDIA_BREAK_POINTS.md}px) {
    grid-template-columns: repeat(1, minmax(250px, 1fr));
  }
  @media (max-width: ${MEDIA_BREAK_POINTS.sm}px) {
    display: flex;
    flex-direction: column;
    grid-gap: 12px;
  }
`

interface UpcomingListItemProps {
  data: LaunchpadUpcomingItemDataType
}
const UpcomingListItem = ({ data }: UpcomingListItemProps) => {
  const { img, name, projectParty, homeUrl, twitterUrl, discordUrl, desc, itemsNum, price, enchanfted } = data
  return (
    <UpcomingListItemWrapper>
      {/* top */}
      <UpcomingListItemTop>
        <img src={img} alt="" />
      </UpcomingListItemTop>
      <HorizontalDividingLine />

      {/* center */}
      <UpcomingListItemCenter>
        <ProjectName>{name}</ProjectName>
        <ProjectPartyName>{projectParty.name}</ProjectPartyName>
      </UpcomingListItemCenter>
      {/* bottom */}
      <UpcomingListItemBottom>
        <ProjectNumItemBox>
          <ProjectNumItemTop>Items</ProjectNumItemTop>
          <ProjectNumItemBottom>{itemsNum}</ProjectNumItemBottom>
        </ProjectNumItemBox>
        <ProjectNumItemLine />
        <ProjectNumItemBox>
          <ProjectNumItemTop>Price</ProjectNumItemTop>
          <ProjectNumItemBottom>{price}</ProjectNumItemBottom>
        </ProjectNumItemBox>
        <ProjectNumItemLine />
        <ProjectNumItemBox>
          <ProjectNumItemTop>Enchanfted</ProjectNumItemTop>
          <ProjectNumItemBottom>{enchanfted}</ProjectNumItemBottom>
        </ProjectNumItemBox>
      </UpcomingListItemBottom>
    </UpcomingListItemWrapper>
  )
}
/**
 * item style
 */
const UpcomingListItemWrapper = styled.div`
  width: 100%;
  height: 480px;
  border: 2px solid #222222;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

// top
const UpcomingListItemTop = styled.div`
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
`
const HorizontalDividingLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: #222222;
`
// center
const UpcomingListItemCenter = styled.div`
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`
const ProjectName = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #222222;
`
const ProjectPartyName = styled.div`
  font-size: 12px;
  line-height: 12px;
  color: #3dd606;
`
// bottom
const UpcomingListItemBottom = styled.div`
  box-sizing: border-box;
  padding: 22px 16px;
  background: rgba(34, 34, 34, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ProjectNumItemBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`
const ProjectNumItemTop = styled.div`
  font-size: 8px;
  line-height: 8px;
  color: rgba(34, 34, 34, 0.5);
`
const ProjectNumItemBottom = styled.div`
  font-size: 14px;
  line-height: 14px;
  color: #222222;
`
const ProjectNumItemLine = styled.div`
  width: 1px;
  height: 20px;
  background: #222222;
`
