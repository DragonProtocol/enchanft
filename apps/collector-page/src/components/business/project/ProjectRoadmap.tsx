/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-11 12:45:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-14 11:29:56
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { RoadmapStatus } from '../../../types/api'
export type ProjectRoadmapItemDataType = {
  id: number
  status: RoadmapStatus
  description: string
  projectId: number
}
export type ProjectRoadmapProps = {
  items: ProjectRoadmapItemDataType[]
}
const ProjectRoadmap: React.FC<ProjectRoadmapProps> = ({ items }) => {
  return (
    <ProjectRoadmapWrapper>
      <Timeline position="alternate">
        {items.map((item, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot
                variant={item.status === RoadmapStatus.DONE ? 'filled' : 'outlined'}
                sx={{
                  borderColor: '#222222',
                  backgroundColor: item.status === RoadmapStatus.DONE ? '#222222' : '',
                }}
              />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <RoadmapItemDescription>{item.description}</RoadmapItemDescription>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </ProjectRoadmapWrapper>
  )
}

export default ProjectRoadmap

const ProjectRoadmapWrapper = styled.div``

const RoadmapItemDescription = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
`
const RoadmapItemContent = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
`

const RoadmapItemStatus = styled.div`
  font-size: 24px;
  line-height: 24px;
  margin-left: 10px;
`
