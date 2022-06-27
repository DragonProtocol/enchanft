/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-23 13:34:41
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-27 16:07:05
 * @FilePath: \synft-app\src\components\launchpad\UnderwayList.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Navigation, Autoplay } from 'swiper'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import 'swiper/css'

import SwiperLeftIcon from '../icons/swiperLeft.svg'
import SwiperRightIcon from '../icons/swiperRight.svg'
import InternetIcon from '../icons/internet.svg'
import TwitterIcon from '../icons/twitter.svg'
import ProjectItemsIcon from '../icons/projectItems.svg'
import ProjectPriceIcon from '../icons/projectPrice.svg'
import ProjectEnchanftedIcon from '../icons/projectEnchanfted.svg'
import SolanaIcon from '../icons/solana.png'
import { CursorPointerUpCss } from '../../GlobalStyle'
import { MOBILE_BREAK_POINT } from '../../utils/constants'

export type LaunchpadUnderwayItemDataType = {
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
interface UnderwayListProps {
  data: LaunchpadUnderwayItemDataType[]
}
const UnderwayList: React.FC<UnderwayListProps> = ({ data }: UnderwayListProps) => {
  return (
    <UnderwayListWrapper>
      <UnderwayListSwiperLeft>
        <img src={SwiperLeftIcon} alt="" className="launchpad-underway-list-swiper-prev" />
      </UnderwayListSwiperLeft>
      <Swiper
        className="launchpad-underway-list-swiper"
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: '.launchpad-underway-list-swiper-next',
          prevEl: '.launchpad-underway-list-swiper-prev',
        }}
        autoplay={{
          delay: 6000,
        }}
        pagination={{
          clickable: true,
        }}
      >
        {data.map((item) => (
          <SwiperSlide>
            <UnderwayListItem data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
      <UnderwayListSwiperRight>
        <img src={SwiperRightIcon} alt="" className="launchpad-underway-list-swiper-next" />
      </UnderwayListSwiperRight>
    </UnderwayListWrapper>
  )
}

export default UnderwayList

/**
 * list style
 */
const UnderwayListWrapper = styled.div`
  width: 100%;
  position: relative;
  border: 4px solid #222222;
  box-sizing: border-box;
`
const UnderwayListSwiperLeft = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-100%, -50%);
  left: -16px;
  ${CursorPointerUpCss}
`
const UnderwayListSwiperRight = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(100%, -50%);
  right: -16px;
  ${CursorPointerUpCss}
`

interface UnderwayListItemProps {
  data: LaunchpadUnderwayItemDataType
}
const UnderwayListItem = ({ data }: UnderwayListItemProps) => {
  const { img, name, projectParty, homeUrl, twitterUrl, discordUrl, desc, itemsNum, price, enchanfted } = data
  return (
    <UnderwayListItemWrapper>
      {/* left */}
      <UnderwayListItemLeft>
        <img src={img} alt="" />
      </UnderwayListItemLeft>
      <VerticalDividingLine />

      {/* right */}
      <UnderwayListItemRight>
        {/* top */}
        <ProjectTopBox>
          <ProjectName>{name}</ProjectName>
          <ProjectPartyBox>
            <ProjectPartyName href={discordUrl} target="_blank" rel="noopener noreferrer">
              {projectParty.name}
            </ProjectPartyName>
            <ProjectPartyLinks>
              <a href={homeUrl} target="_blank" rel="noopener noreferrer">
                <img src={InternetIcon} alt="" />
              </a>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                <img src={TwitterIcon} alt="" />
              </a>
            </ProjectPartyLinks>
          </ProjectPartyBox>
        </ProjectTopBox>

        {/* detail */}
        <ProjectDetailBox>
          <ProjectDesc>{desc}</ProjectDesc>
          <ProjectNumListBox>
            <ProjectNumItemBox>
              <ProjectNumItemLeft>
                <img src={ProjectItemsIcon} alt="" />
                <span>Items</span>
              </ProjectNumItemLeft>
              <ProjectNumItemRight>
                <span>{itemsNum}</span>
              </ProjectNumItemRight>
            </ProjectNumItemBox>
            <ProjectNumItemBox>
              <ProjectNumItemLeft>
                <img src={ProjectPriceIcon} alt="" />
                <span>Price</span>
              </ProjectNumItemLeft>
              <ProjectNumItemRight>
                <img src={SolanaIcon} alt="" />
                <span>{price}</span>
                <span>SOL</span>
              </ProjectNumItemRight>
            </ProjectNumItemBox>
            <ProjectNumItemBox>
              <ProjectNumItemLeft>
                <img src={ProjectEnchanftedIcon} alt="" />
                <span>Enchanfted</span>
              </ProjectNumItemLeft>
              <ProjectNumItemRight>
                <img src={SolanaIcon} alt="" />
                <span>{enchanfted}</span>
                <span>SOL</span>
              </ProjectNumItemRight>
            </ProjectNumItemBox>
          </ProjectNumListBox>
        </ProjectDetailBox>
      </UnderwayListItemRight>
    </UnderwayListItemWrapper>
  )
}
/**
 * item style
 */
const UnderwayListItemWrapper = styled.div`
  width: 100%;
  height: 500px;
  background: #ffffff;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  display: flex;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
    height: auto;
  }
`

// left
const UnderwayListItemLeft = styled.div`
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex: 0;
    height: auto;
    img {
      height: auto;
    }
  }
`
const VerticalDividingLine = styled.div`
  width: 4px;
  height: 100%;
  background-color: #222222;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    display: none;
  }
`

// right
const UnderwayListItemRight = styled.div`
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  padding: 24px;
  display: flex;
  flex-direction: column;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex: 0;
    height: auto;
  }
`
// top
const ProjectTopBox = styled.div`
  border-bottom: 1px solid #d9d9d9;
`
const ProjectName = styled.div`
  font-weight: 400;
  font-size: 24px;
  line-height: 40px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 16px;
  }
`
const ProjectPartyBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 16px;
`
const ProjectPartyName = styled.a`
  font-size: 12px;
  line-height: 12px;
  color: #3dd606;
  text-decoration: none;
  ${CursorPointerUpCss}
`
const ProjectPartyLinks = styled.div`
  display: flex;
  gap: 26px;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    ${CursorPointerUpCss}
  }
`
// detail
const ProjectDetailBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
`
const ProjectDesc = styled.div`
  flex: 1;
  padding-top: 16px;
  overflow-y: auto;
  font-size: 12px;
  line-height: 24px;
  color: rgba(34, 34, 34, 0.6);
`
const ProjectNumListBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`
const ProjectNumItemBox = styled.div`
  height: 60px;
  border: 2px solid #222222;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
  }
`
const ProjectNumItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`
const ProjectNumItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`
