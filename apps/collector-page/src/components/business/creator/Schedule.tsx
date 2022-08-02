import React from 'react'
import styled from 'styled-components'

import { ScheduleInfo } from '../../../features/creator'
import CardBox from '../../common/card/CardBox'
import IconCheckboxChecked from '../../common/icons/IconCheckboxChecked'
import IconCheckbox from '../../common/icons/IconCheckbox'
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
    <ScheduleBox>
      <h3>Schedule</h3>
      <TimelineBox>
        {data.map((item, idx) => {
          const itemDate = item?.date ? new Date(item?.date) : dateNow
          const done = dateNow > itemDate
          return (
            <div className="item" key={item.title}>
              {(done && <IconCheckboxChecked />) || <IconCheckbox />}
              <p className="title">{item.title}</p>
              <p>{itemDate.toLocaleDateString()}</p>
            </div>
          )
        })}
      </TimelineBox>
    </ScheduleBox>
  )
}

const TimelineBox = styled.div`
  margin-top: 20px;
  & div.item {
    position: relative;
    padding-bottom: 10px;
    &:before {
      content: '';
      position: absolute;
      border-left: 1px solid #33333333;
      height: calc(100% - 18px);
      top: 18px;
      left: 12px;
    }
    &:last-child::before {
      content: none;
    }
  }

  & svg {
    position: absolute;
    height: 18px;
  }
  & p {
    margin: 0;
    font-weight: 400;
    font-size: 10px;
    line-height: 20px;
    margin-left: 30px;
    color: rgba(51, 51, 51, 0.4);
  }
  & .title {
    font-weight: 400;
    font-size: 10px;
    line-height: 20px;

    color: #333333;
  }
`

const ScheduleBox = styled(CardBox)`
  margin-top: 20px;
  padding: 20px;
  & h3 {
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: #333333;
  }
`
