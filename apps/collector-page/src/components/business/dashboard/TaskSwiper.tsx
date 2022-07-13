/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:25:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-13 15:02:12
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { Navigation, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import SwiperPrevIcon from '@mui/icons-material/ArrowBackIos'
import SwiperNextIcon from '@mui/icons-material/ArrowForwardIos'

import TaskSwiperItem, { TaskSwiperItemDataViewType, TaskSwiperItemHandlesType } from './TaskSwiperItem'
import IconButton from '@mui/material/IconButton'
import { SwiperModule } from 'swiper/types'
export type TaskSwiperViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type TaskSwiperItemsType = TaskSwiperItemDataViewType[]
export type TaskSwiperProps = TaskSwiperViewConfigType &
  TaskSwiperItemHandlesType & {
    items: TaskSwiperItemsType
  }
const TaskSwiper: React.FC<TaskSwiperProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg,
  onTake,
}: TaskSwiperProps) => {
  const itemLen = items.length
  const modules = itemLen > 1 ? [Navigation, Autoplay] : []
  const pagination = {
    clickable: itemLen > 1 ? true : false,
  }
  const loop = itemLen > 1 ? true : false
  return (
    <TaskSwiperWrapper>
      {itemLen > 1 && (
        <TaskSwiperLeft>
          <IconButton className="dashboard-task-swiper-prev">
            <SwiperPrevIcon />
          </IconButton>
        </TaskSwiperLeft>
      )}

      <Swiper
        className="dashboard-task-swiper"
        spaceBetween={50}
        slidesPerView={1}
        loop={loop}
        modules={modules}
        navigation={{
          nextEl: '.dashboard-task-swiper-next',
          prevEl: '.dashboard-task-swiper-prev',
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
              <TaskSwiperItem data={item.data} viewConfig={item.viewConfig} onTake={onTake} />
            </SwiperSlide>
          ))
        )}
      </Swiper>
      {itemLen > 1 && (
        <TaskSwiperRight>
          <IconButton className="dashboard-task-swiper-next">
            <SwiperNextIcon />
          </IconButton>
        </TaskSwiperRight>
      )}

      {!loading && itemLen === 0 && emptyMsg && <TaskSwiperEmpty>{emptyMsg}</TaskSwiperEmpty>}
    </TaskSwiperWrapper>
  )
}
export default TaskSwiper
const TaskSwiperWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
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
