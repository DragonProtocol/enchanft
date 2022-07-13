/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-07 20:25:08
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
      <TaskSwiperItemBox>
        <ProjectContent data={data.project} />
      </TaskSwiperItemBox>
      <VerticalDividingLine />
      <TaskSwiperItemBox>
        <TaskContent data={data} viewConfig={viewConfig} onTake={onTake} />
      </TaskSwiperItemBox>
    </TaskSwiperItemWrapper>
  )
}
export default TaskSwiperItem
const TaskSwiperItemWrapper = styled.div`
  width: 100%;
  height: 468px;
  background: #ffffff;
  box-sizing: border-box;
  border: 2px solid rgba(21, 21, 21, 100);
  border-radius: 10px;
  display: flex;
`
const TaskSwiperItemBox = styled.div`
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  padding: 13px 42px 42px 42px;
`
const VerticalDividingLine = styled.div`
  width: 4px;
  height: 100%;
  background-color: #222222;
`
