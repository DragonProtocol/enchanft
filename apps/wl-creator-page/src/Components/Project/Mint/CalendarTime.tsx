import dayjs from 'dayjs';
import { useState } from 'react';
import styled from 'styled-components';
import ArrowDown from '../../Icons/svgs/arrow_down.svg';
import { Box } from './Box';

export default function CalendarTime({
  startDate,
  endDate,
  updateStartDate,
  updateEndDate,
}: {
  startDate?: Date;
  endDate?: Date;
  updateStartDate?: (arg0: number) => void;
  updateEndDate?: (arg0: number) => void;
}) {
  return (
    <TimeBox>
      <h4>Expect Whitelist mint calendar date and time(UTC)</h4>
      <div className="area">
        <div className="input-area">
          <input
            title="time"
            type="datetime-local"
            className="date"
            value={dayjs(startDate).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => {
              updateStartDate &&
                updateStartDate(dayjs(e.target.value).toDate().getTime());
            }}
          />
        </div>
        <span></span>
        <div className="input-area">
          <input
            title="time"
            type="datetime-local"
            className="date"
            value={dayjs(endDate).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => {
              updateEndDate &&
                updateEndDate(dayjs(e.target.value).toDate().getTime());
            }}
          />
        </div>
      </div>
    </TimeBox>
  );
}

const TimeBox = styled(Box)`
  & .area {
    display: flex;
    gap: 10px;
    align-items: center;
    & span {
      display: inline-block;
      width: 20px;
      height: 2px;
      background-color: #333;
    }
    & .input-area {
      width: 250px;
      box-sizing: border-box;
    }
  }
  & input::-webkit-calendar-picker-indicator {
    border: none;
    outline: none;

    background-color: #ebeee4;

    background: url(${ArrowDown});
    background-repeat: no-repeat;
    /* background-position-x: -2px; */
    background-position-y: 2px;
  }
`;
