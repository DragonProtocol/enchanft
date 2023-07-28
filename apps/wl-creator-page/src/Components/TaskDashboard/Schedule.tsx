import React, { useMemo } from 'react';
import styled from 'styled-components';
import IconCheckbox from '../Icons/IconCheckbox';
import IconCheckboxChecked from '../Icons/IconCheckboxChecked';
import { RewardType, ScheduleInfo } from '../TaskCreate/type';

// {
//   title: string
//   date: string
//   done: boolean
// }
export default function Schedule({
  schedules,
  reward,
}: {
  schedules: ScheduleInfo | null;
  reward: { raffled: boolean; type: RewardType };
}) {
  const dateNow = new Date();
  let closeTime = new Date(0).getTime();

  const data = useMemo(() => {
    const data: Array<{ title: string; date: string }> = [];
    if (schedules?.submitTime) {
      data.push({
        title: 'Task submit date',
        date: schedules?.submitTime,
      });
    }
    if (schedules?.startTime) {
      data.push({
        title: 'Task start',
        date: schedules?.startTime,
      });
    }

    if (schedules?.pickWinnersTime && reward.raffled) {
      data.push({
        title: 'Pick Entries',
        date: schedules?.pickWinnersTime,
      });
    }

    if (schedules?.endTime) {
      data.push({
        title: 'Task end',
        date: schedules?.endTime,
      });
    }

    if (schedules?.closeTime) {
      data.push({
        title: 'Task close',
        date: schedules?.closeTime,
      });
    }
    return data.sort((a, b) => {
      const aDate = a?.date ? new Date(a?.date) : dateNow;
      const bDate = b?.date ? new Date(b?.date) : dateNow;
      return aDate.getTime() - bDate.getTime();
    });
  }, [schedules, reward]);

  return (
    <ScheduleBox>
      <h3>Schedule</h3>
      <TimelineBox>
        {data.map((item, idx) => {
          const itemDate = item?.date ? new Date(item?.date) : dateNow;
          const done = dateNow > itemDate;
          if (itemDate.getTime() == closeTime) return null;
          return (
            <div className="item" key={item.title}>
              {(done && <IconCheckboxChecked />) || <IconCheckbox />}
              <p className="title">{item.title}</p>
              <p>{itemDate.toLocaleDateString()}</p>
            </div>
          );
        })}
      </TimelineBox>
    </ScheduleBox>
  );
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
    margin-left: 30px;
    font-size: 12px;
    line-height: 20px;
    color: rgba(51, 51, 51, 0.4);
  }
  & .title {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #333333;
  }
`;

const ScheduleBox = styled.div`
  padding: 20px;
  & h3 {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #333333;
  }
`;