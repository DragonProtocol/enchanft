/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:25:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 15:27:47
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { Navigation, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import SwiperPrevIcon from '@mui/icons-material/ArrowBackIos'
import SwiperNextIcon from '@mui/icons-material/ArrowForwardIos'

import ExploreTaskSwiperItem, {
  ExploreTaskSwiperItemDataViewType,
  ExploreTaskSwiperItemHandlesType,
} from './ExploreTaskSwiperItem'
import IconButton from '@mui/material/IconButton'
export type ExploreTaskSwiperViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type ExplorTaskSwiperItemsType = ExploreTaskSwiperItemDataViewType[]
export type ExploreTaskSwiperProps = ExploreTaskSwiperViewConfigType &
  ExploreTaskSwiperItemHandlesType & {
    items: ExplorTaskSwiperItemsType
  }
const ExploreTaskSwiper: React.FC<ExploreTaskSwiperProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg,
}: ExploreTaskSwiperProps) => {
  const itemLen = items.length
  const modules = itemLen > 1 ? [Navigation, Autoplay] : []
  const pagination = {
    clickable: itemLen > 1 ? true : false,
  }
  const loop = itemLen > 1 ? true : false
  return (
    <ExploreTaskSwiperWrapper>
      {itemLen > 1 && (
        <TaskSwiperLeft>
          <IconButton className="explore-task-swiper-prev">
            <SwiperPrevIcon />
          </IconButton>
        </TaskSwiperLeft>
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
            <TaskSwiperLoading>{loadingMsg}</TaskSwiperLoading>
          </SwiperSlide>
        ) : (
          items.map((item) => (
            <SwiperSlide key={item.data.id}>
              <ExploreTaskSwiperItem data={item.data} viewConfig={item.viewConfig} />
            </SwiperSlide>
          ))
        )}
      </Swiper>
      {itemLen > 1 && (
        <TaskSwiperRight>
          <IconButton className="explore-task-swiper-next">
            <SwiperNextIcon />
          </IconButton>
        </TaskSwiperRight>
      )}

      {!loading && itemLen === 0 && emptyMsg && <TaskSwiperEmpty>{emptyMsg}</TaskSwiperEmpty>}
    </ExploreTaskSwiperWrapper>
  )
}
export default ExploreTaskSwiper
const ExploreTaskSwiperWrapper = styled.div`
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
const TaskSwiperLeft = styled.div`
  cursor: pointer;
`
const TaskSwiperRight = styled.div`
  cursor: pointer;
`
const TaskSwiperLoading = styled.div`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`
const TaskSwiperEmpty = styled.div`
  text-align: center;
  margin-top: 20px;
`
