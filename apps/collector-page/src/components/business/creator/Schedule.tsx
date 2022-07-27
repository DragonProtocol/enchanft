import React from 'react'
import styled from 'styled-components'

import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import { ScheduleInfo } from '../../../features/creator'
// {
//   title: string
//   date: string
//   done: boolean
// }
export default function Schedule({ schedules }: { schedules: ScheduleInfo | null }) {
  const dateNow = new Date()
  const data = [
    {
      title: 'Task submit date',
      date: schedules?.submitTime,
    },
    {
      title: 'Task start',
      date: schedules?.startTime,
    },
    {
      title: 'Task end',
      date: schedules?.endTime,
    },
    {
      title: 'Task close',
      date: schedules?.closeTime,
    },
  ]
  return (
    <ScheduleBox className="box">
      <h3>Schedule</h3>
      <Timeline
        sx={{
          mx: 0,
          p: 0,
        }}
      >
        {data.map((item, idx) => {
          const itemDate = item?.date ? new Date(item?.date) : dateNow
          const done = dateNow > itemDate
          return (
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
                  variant={done ? 'filled' : 'outlined'}
                  sx={{
                    borderColor: '#222222',
                    backgroundColor: done ? '#222222' : '',
                  }}
                />
                {idx === data.length - 1 ? null : <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <p className="title">{item.title}</p>
                <p>{itemDate.toLocaleString()}</p>
              </TimelineContent>
            </TimelineItem>
          )
        })}
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
