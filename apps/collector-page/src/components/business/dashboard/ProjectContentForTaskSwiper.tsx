/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-06 11:51:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-07 21:04:43
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
  return (
    <ProjectContentWrapper>
      <ProjectTopBox>
        <ProjectName>{name}</ProjectName>
        <ProjectStatusLabel>
          <ProjectStatusLabelLeft />
          {statusLabel}
        </ProjectStatusLabel>
      </ProjectTopBox>
      <ProjectBottomBox>
        <ProjectImage src={image} />
      </ProjectBottomBox>
    </ProjectContentWrapper>
  )
}
export default ProjectContent
const ProjectContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
`
const ProjectTopBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`
const ProjectBottomBox = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: hidden;
`
const ProjectName = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  font-weight: bold;
`
const ProjectStatusLabel = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`
const ProjectStatusLabelLeft = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  line-height: 20px;
  background-color: rgba(112, 225, 55, 100);
`
const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
`
