/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 13:41:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-05 10:39:50
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import TaskDefaultImage from '../../imgs/task_default.png'
type TaskImageDefaultProps = HTMLAttributes<HTMLImageElement> & {
  src?: string
}
const TaskImageDefault: React.FC<TaskImageDefaultProps> = ({ src, ...otherProps }: TaskImageDefaultProps) => {
  return <TaskImageDefaultWrapper src={src || TaskDefaultImage} {...otherProps} />
}
export default TaskImageDefault
const TaskImageDefaultWrapper = styled.img``
