/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 16:03:47
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 16:24:50
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { ProjectStatus } from '../../../types/api'

const ProjectStatusColors = {
  [ProjectStatus.ACTIVE]: '#3DD606',
  [ProjectStatus.LIVE]: '#3DD606',
  [ProjectStatus.FUTURE]: '#EBB700',
}
export const ProjectStatusLabels = {
  [ProjectStatus.ACTIVE]: 'Active',
  [ProjectStatus.LIVE]: 'Live',
  [ProjectStatus.FUTURE]: 'Future',
}
type ProjectStatusLabelProps = HTMLAttributes<HTMLDivElement> & {
  status: ProjectStatus
  fontSize?: string
}
const ProjectStatusLabel: React.FC<ProjectStatusLabelProps> = ({
  status,
  fontSize = '12px',
}: ProjectStatusLabelProps) => {
  const statusLabel = ProjectStatusLabels[status] || 'Unknown Project Status'
  const statusColor = ProjectStatusColors[status] || '#000'
  return (
    <ProjectStatusLabelWrapper color={statusColor} fontSize={fontSize}>
      <ProjectStatusLabelLeft color={statusColor} />
      {statusLabel}
    </ProjectStatusLabelWrapper>
  )
}
export default ProjectStatusLabel
const ProjectStatusLabelWrapper = styled.div<{ color: string; fontSize?: string }>`
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: ${({ fontSize }) => fontSize};
  line-height: 18px;
  color: ${({ color }) => color};
`
const ProjectStatusLabelLeft = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  line-height: 20px;
  background-color: ${({ color }) => color};
`
