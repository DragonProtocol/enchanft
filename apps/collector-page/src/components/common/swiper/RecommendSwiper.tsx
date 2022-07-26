import React from 'react'
import styled from 'styled-components'
import { Navigation, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import SwiperPrevIcon from '@mui/icons-material/ArrowBackIos'
import SwiperNextIcon from '@mui/icons-material/ArrowForwardIos'

import IconButton from '@mui/material/IconButton'
export type RecommendSwiperProps = {
  children: React.ReactNode
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
  navigation?: boolean
  autoplay?: boolean
  pagination?: boolean
  loop?: boolean
}
const RecommendSwiper: React.FC<RecommendSwiperProps> = ({
  children,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'empty',
  navigation,
  autoplay,
  pagination,
  loop,
}: RecommendSwiperProps) => {
  const modulesConfig: any[] = []
  if (navigation) {
    modulesConfig.push(Navigation)
  }
  if (autoplay) {
    modulesConfig.push(Autoplay)
  }
  const paginationConfig = {
    clickable: pagination ? true : false,
  }
  const loopConfig = loop ? true : false
  return (
    <RecommendSwiperWrapper>
      {navigation && (
        <RecommendSwiperLeft>
          <IconButton className="recommend-swiper-prev">
            <SwiperPrevIcon />
          </IconButton>
        </RecommendSwiperLeft>
      )}
      <Swiper
        className="recommend-swiper"
        spaceBetween={50}
        slidesPerView={1}
        loop={loopConfig}
        modules={modulesConfig}
        navigation={{
          nextEl: '.recommend-swiper-next',
          prevEl: '.recommend-swiper-prev',
        }}
        autoplay={{
          delay: 6000,
        }}
        pagination={paginationConfig}
      >
        {loading ? (
          <RecommendSwiperItem>
            <RecommendSwiperLoading>{loadingMsg}</RecommendSwiperLoading>
          </RecommendSwiperItem>
        ) : (
          children || (
            <RecommendSwiperItem>
              <RecommendSwiperEmpty>{emptyMsg}</RecommendSwiperEmpty>
            </RecommendSwiperItem>
          )
        )}
      </Swiper>
      {navigation && (
        <RecommendSwiperRight>
          <IconButton className="recommend-swiper-next">
            <SwiperNextIcon />
          </IconButton>
        </RecommendSwiperRight>
      )}
    </RecommendSwiperWrapper>
  )
}
export default RecommendSwiper
const RecommendSwiperWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  .recommend-swiper {
    flex: 1;
    height: 440px;
    background: #ffffff;
    box-sizing: border-box;
    border: 4px solid #333333;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    padding: 40px;
  }
`
const RecommendSwiperLeft = styled.div`
  cursor: pointer;
`
const RecommendSwiperRight = styled.div`
  cursor: pointer;
`
const RecommendSwiperLoading = styled.div`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`
const RecommendSwiperEmpty = styled.div`
  text-align: center;
  margin-top: 20px;
`
export const RecommendSwiperItem = SwiperSlide
