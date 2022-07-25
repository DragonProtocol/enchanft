import React from 'react'
import styled from 'styled-components'

import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'

export default function Schedule({
  schedules,
}: {
  schedules: Array<{
    title: string
    date: string
    done: boolean
  }>
}) {
  return (
    <ScheduleBox className="box">
      <h3>Schedule</h3>
      <Timeline
        sx={{
          mx: 0,
          p: 0,
        }}
      >
        {schedules.map((item, idx) => (
          <TimelineItem
            key={item.title}
            sx={{
              ':before': {
                content: 'none',
              },
            }}
          >
            <TimelineSeparator>
              <TimelineDot
                variant={item.done ? 'filled' : 'outlined'}
                sx={{
                  borderColor: '#222222',
                  backgroundColor: item.done ? '#222222' : '',
                }}
              />
              {idx === schedules.length - 1 ? null : <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <p className="title">{item.title}</p>
              <p>{item.date}</p>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </ScheduleBox>
  )
}

const ScheduleBox = styled.div`
  margin-top: 20px;
  & .title {
    margin: 0px;
  }
`
