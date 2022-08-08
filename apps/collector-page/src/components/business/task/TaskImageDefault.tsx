/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 13:41:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-08 17:00:19
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import default_image_1 from './imgs/default_image_1.png'
import default_image_2 from './imgs/default_image_2.png'
import default_image_3 from './imgs/default_image_3.png'
import default_image_4 from './imgs/default_image_4.png'
type TaskImageDefaultProps = HTMLAttributes<HTMLImageElement> & {
  src?: string
}
const TaskImageDefault: React.FC<TaskImageDefaultProps> = ({ src, ...otherProps }: TaskImageDefaultProps) => {
  let imageSrc = src
  if (!imageSrc) {
    const images = [default_image_1, default_image_2, default_image_3, default_image_4]
    imageSrc = images[Math.floor(Math.random() * images.length)]
  }
  return <TaskImageDefaultWrapper src={imageSrc} {...otherProps} />
}
export default TaskImageDefault
const TaskImageDefaultWrapper = styled.img``
