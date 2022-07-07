/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:25:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-07 19:50:45
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
const TaskSwiper: React.FC<TaskSwiperProps> = ({ items, loading, loadingMsg, emptyMsg, onTake }: TaskSwiperProps) => (
  <TaskSwiperWrapper>
    <TaskSwiperLeft>
      <IconButton className="dashboard-task-swiper-prev">
        <SwiperPrevIcon />
      </IconButton>
    </TaskSwiperLeft>
    <Swiper
      className="dashboard-task-swiper"
      spaceBetween={50}
      slidesPerView={1}
      loop={true}
      modules={[Navigation, Autoplay]}
      navigation={{
        nextEl: '.dashboard-task-swiper-next',
        prevEl: '.dashboard-task-swiper-prev',
      }}
      autoplay={{
        delay: 6000,
      }}
      pagination={{
        clickable: true,
      }}
    >
      {items.map((item) => (
        <SwiperSlide key={item.data.id}>
          <TaskSwiperItem data={item.data} viewConfig={item.viewConfig} onTake={onTake} />
        </SwiperSlide>
      ))}
    </Swiper>
    <TaskSwiperRight>
      <IconButton className="dashboard-task-swiper-next">
        <SwiperNextIcon />
      </IconButton>
    </TaskSwiperRight>
    {loading && (
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        {loadingMsg}
      </div>
    )}
    {!loading && items.length === 0 && emptyMsg && (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>{emptyMsg}</div>
    )}
  </TaskSwiperWrapper>
)
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
