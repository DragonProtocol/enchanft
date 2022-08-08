/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 13:41:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-08 18:32:33
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { TASK_DEFAULT_IMAGE_URL } from '../../../constants'
type TaskImageDefaultProps = HTMLAttributes<HTMLImageElement> & {
  src?: string
}
const TaskImageDefault: React.FC<TaskImageDefaultProps> = ({ src, ...otherProps }: TaskImageDefaultProps) => {
  return <TaskImageDefaultWrapper src={src || TASK_DEFAULT_IMAGE_URL} {...otherProps} />
}
export default TaskImageDefault
const TaskImageDefaultWrapper = styled.img``
