/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-06 11:51:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-06 18:21:03
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { ProjectStatus } from '../../../types/api'

export type ProjectContentDataType = {
  id: number
  name: string
  image: string
  status: ProjectStatus
}

export type ProjectContentProps = {
  data: ProjectContentDataType
}

const ProjectStatusLabels = {
  [ProjectStatus.ACTIVE]: 'Active',
  [ProjectStatus.LIVE]: 'Live',
  [ProjectStatus.FUTURE]: 'Future',
}

const ProjectContent: React.FC<ProjectContentProps> = ({ data }: ProjectContentProps) => {
  const { id, name, image, status } = data
  const statusLabel = ProjectStatusLabels[status] || 'Unknown Project Status'
  return <ProjectContentWrapper>aaa</ProjectContentWrapper>
}
export default ProjectContent
const ProjectContentWrapper = styled.div``
