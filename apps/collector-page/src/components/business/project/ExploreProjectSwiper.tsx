/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:25:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-22 18:41:57
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { Navigation, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import SwiperPrevIcon from '@mui/icons-material/ArrowBackIos'
import SwiperNextIcon from '@mui/icons-material/ArrowForwardIos'

import ExploreProjectSwiperItem, {
  ExploreProjectSwiperItemDataViewType,
  ExploreProjectSwiperItemHandlesType,
} from './ExploreProjectSwiperItem'
import IconButton from '@mui/material/IconButton'
export type ExploreProjectSwiperViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type ExplorProjectSwiperItemsType = ExploreProjectSwiperItemDataViewType[]
export type ExploreProjectSwiperProps = ExploreProjectSwiperViewConfigType &
  ExploreProjectSwiperItemHandlesType & {
    items: ExplorProjectSwiperItemsType
  }
const ExploreProjectSwiper: React.FC<ExploreProjectSwiperProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg,
}: ExploreProjectSwiperProps) => {
  const itemLen = items.length
  const modules = itemLen > 1 ? [Navigation, Autoplay] : []
  const pagination = {
    clickable: itemLen > 1 ? true : false,
  }
  const loop = itemLen > 1 ? true : false
  return (
    <ExploreProjectSwiperWrapper>
      {itemLen > 1 && (
        <ProjectSwiperLeft>
          <IconButton className="explore-task-swiper-prev">
            <SwiperPrevIcon />
          </IconButton>
        </ProjectSwiperLeft>
      )}
      <Swiper
        className="explore-task-swiper"
        spaceBetween={50}
        slidesPerView={1}
        loop={loop}
        modules={modules}
        navigation={{
          nextEl: '.explore-task-swiper-next',
          prevEl: '.explore-task-swiper-prev',
        }}
        autoplay={{
          delay: 6000,
        }}
        pagination={pagination}
      >
        {loading ? (
          <SwiperSlide>
            <ProjectSwiperLoading>{loadingMsg}</ProjectSwiperLoading>
          </SwiperSlide>
        ) : (
          items.map((item) => (
            <SwiperSlide key={item.data.id}>
              <ExploreProjectSwiperItem data={item.data} viewConfig={item.viewConfig} />
            </SwiperSlide>
          ))
        )}
      </Swiper>
      {itemLen > 1 && (
        <ProjectSwiperRight>
          <IconButton className="explore-task-swiper-next">
            <SwiperNextIcon />
          </IconButton>
        </ProjectSwiperRight>
      )}

      {!loading && itemLen === 0 && emptyMsg && <ProjectSwiperEmpty>{emptyMsg}</ProjectSwiperEmpty>}
    </ExploreProjectSwiperWrapper>
  )
}
export default ExploreProjectSwiper
const ExploreProjectSwiperWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  .explore-task-swiper {
    flex: 1;
    height: 440px;
    background: #ffffff;
    box-sizing: border-box;
    border: 4px solid #333333;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    padding: 40px;
  }
`
const ProjectSwiperLeft = styled.div`
  cursor: pointer;
`
const ProjectSwiperRight = styled.div`
  cursor: pointer;
`
const ProjectSwiperLoading = styled.div`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`
const ProjectSwiperEmpty = styled.div`
  text-align: center;
  margin-top: 20px;
`
