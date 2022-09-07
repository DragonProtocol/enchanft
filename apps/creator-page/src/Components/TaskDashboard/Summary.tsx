import React from 'react';
import styled from 'styled-components';
import { getTaskRewardTypeLabel } from '../../utils/task';
import PngIconAlarmClock from '../Icons/PngIconAlarmClock';
import PngIconScissorHand from '../Icons/PngIconScissorHand';
import { RewardType, TaskInfo } from '../TaskCreate/type';

export default function Summary({
  info,
  reward,
}: {
  info: TaskInfo | null;
  reward: { raffled: boolean; type: RewardType };
}) {
  return (
    <TaskTitleBox>
      <h3>{info?.name}</h3>
      <hr />
      <div>
        <h4>{getTaskRewardTypeLabel(reward)}</h4>
        <div className="alarm-clock">
          <span>
            <PngIconAlarmClock />{' '}
            {info?.startTime && new Date(info?.startTime).toLocaleDateString()}—
            {info?.endTime && new Date(info?.endTime).toLocaleDateString()}
          </span>
          <span>
            <PngIconScissorHand />
            Entries {info?.winnerNum}
          </span>
        </div>
        <hr />
        <div className="items">
          {info?.actions.map((item, idx) => {
            return <Item key={idx} content={item} />;
          })}
        </div>
      </div>
    </TaskTitleBox>
  );
}

function Item({ content }: { content: string }) {
  return (
    <p className="item">
      {/* <IconCheckbox /> */}
      {content}
    </p>
  );
}

const TaskTitleBox = styled.div`
  /* height: 411px; */
  line-height: 20px;
  background: #fffbdb;
  padding: 20px;

  & h3 {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #333333;
  }

  & h4 {
    font-weight: 700;
    font-size: 14px;
    line-height: 21px;
    color: #333333;
  }

  & hr {
    border-color: rgba(51, 51, 51, 0.2);
    margin: 10px 0;
  }

  & .alarm-clock {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    color: #333333;
    > span {
      & img {
        height: 20px;
        margin-right: 5px;
      }
      height: 29px;
      background: #d3ed85;
      border-radius: 20px;
      margin: 0;
      display: flex;
      align-items: center;
      padding: 2px 10px;
      font-weight: 700;
      font-size: 14px;
      line-height: 21px;
      color: #333333;
    }
  }
  & .items {
    margin-top: 15px;
    & .item {
      display: flex;
      align-items: center;
      margin: 10px 0;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #333333;
      color: #333333;
      & svg {
        height: 18px;
        width: 18px;
        margin-right: 10px;
      }
    }
  }
`;
