/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-11 12:45:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-15 13:46:39
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
import { RoadmapStatus } from '../../../types/entities'
import IconCheckboxChecked from '../../common/icons/IconCheckboxChecked'
import IconCheckbox from '../../common/icons/IconCheckbox'
import RichTextBox from '../../common/text/RichTextBox'
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
      <CustomTimeline>
        {items.map((item, index) => (
          <CustomTimelineItem key={index}>
            <CustomTimelineSeparator>
              <CustomTimelineDot>
                {item.status === RoadmapStatus.DONE ? <IconCheckboxChecked /> : <IconCheckbox />}
              </CustomTimelineDot>
              <CustomTimelineConnector />
            </CustomTimelineSeparator>
            <CustomTimelineContent>
              <RoadmapItemDescription value={item.description} />
            </CustomTimelineContent>
          </CustomTimelineItem>
        ))}
      </CustomTimeline>
    </ProjectRoadmapWrapper>
  )
}

export default ProjectRoadmap

const ProjectRoadmapWrapper = styled.div`
  width: 100%;
`

const RoadmapItemDescription = styled(RichTextBox)``

const CustomTimeline = styled(Timeline)`
  width: 100%;
  padding: 0;
  margin: 0;
  &::before {
    display: none;
  }
`
const CustomTimelineItem = styled(TimelineItem)`
  display: flex;
  &::before {
    display: none;
  }
`
const CustomTimelineSeparator = styled(TimelineSeparator)``

const CustomTimelineDot = styled(TimelineDot)`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
`

const CustomTimelineConnector = styled(TimelineConnector)`
  width: 1px;
  background-color: rgba(51, 51, 51, 0.2);
`

const CustomTimelineContent = styled(TimelineContent)`
  flex: 1;
  padding: 0;
  padding-left: 10px;
  box-sizing: border-box;
  overflow: hidden;
`
