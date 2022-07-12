/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:25:33
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-12 14:39:59
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { Pagination, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import TaskContent, { TaskContentDataViewType, TaskContentHandlesType } from '../task/TaskContent'
export type ProjectTaskSwiperViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type ProjectTaskSwiperItemsType = TaskContentDataViewType[]
export type ProjectTaskSwiperProps = ProjectTaskSwiperViewConfigType &
  TaskContentHandlesType & {
    items: ProjectTaskSwiperItemsType
  }
const ProjectTaskSwiper: React.FC<ProjectTaskSwiperProps> = ({
  items,
  loading,
  loadingMsg,
  emptyMsg = 'No tasks',
  onTake,
}: ProjectTaskSwiperProps) => (
  <ProjectTaskSwiperWrapper>
    <Swiper
      className="project-task-swiper"
      spaceBetween={50}
      slidesPerView={1}
      loop={true}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 6000,
      }}
      pagination={{
        clickable: true,
      }}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>
          <TaskContent data={item.data} viewConfig={item.viewConfig} onTake={onTake} />
        </SwiperSlide>
      ))}
    </Swiper>
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
  </ProjectTaskSwiperWrapper>
)
export default ProjectTaskSwiper
const ProjectTaskSwiperWrapper = styled.div`
  width: 100%;
  height: 100%;
  .project-task-swiper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .swiper-wrapper {
      height: calc(100% - 20px);
    }
    .swiper-pagination {
      position: relative;
      margin-top: 10px;
    }
  }
`
