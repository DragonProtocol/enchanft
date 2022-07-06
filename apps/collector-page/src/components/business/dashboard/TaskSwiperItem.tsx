/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-06 18:21:12
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import TaskContent, {
  TaskContentDataType,
  TaskContentHandlesType,
  TaskContentViewConfigType,
} from '../task/TaskContent'
import ProjectContent, { ProjectContentDataType } from './ProjectContentForTaskSwiper'

export type TaskSwiperItemDataType = TaskContentDataType & {
  project: ProjectContentDataType
}

export type TaskSwiperItemDataViewType = {
  data: TaskSwiperItemDataType
  viewConfig?: TaskContentViewConfigType
}

export type TaskSwiperItemHandlesType = TaskContentHandlesType

export type TaskSwiperItemProps = TaskSwiperItemDataViewType & TaskSwiperItemHandlesType

const TaskSwiperItem: React.FC<TaskSwiperItemProps> = ({ data, viewConfig, onTake }: TaskSwiperItemProps) => {
  return (
    <TaskSwiperItemWrapper>
      <ProjectContent data={data.project} />
      <TaskContent data={data} viewConfig={viewConfig} onTake={onTake} />
    </TaskSwiperItemWrapper>
  )
}
export default TaskSwiperItem
const TaskSwiperItemWrapper = styled.div``
