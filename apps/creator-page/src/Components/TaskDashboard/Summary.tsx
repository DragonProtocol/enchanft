import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { selectProjectDetail } from '../../redux/projectSlice';
import { useAppSelector } from '../../redux/store';
import { getTaskRewardTypeLabel } from '../../utils/task';
import PngIconAlarmClock from '../Icons/PngIconAlarmClock';
import PngIconGiftBox from '../Icons/PngIconGiftBox';
import PngIconScissorHand from '../Icons/PngIconScissorHand';
import { RewardType, TaskInfo } from '../TaskCreate/type';

export default function Summary({
  info,
  reward,
}: {
  info: TaskInfo | null;
  reward: { raffled: boolean; type: RewardType };
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: project } = useAppSelector(selectProjectDetail);
  return (
    <TaskTitleBox>
      <div className="title">
        <h3>{project?.name}</h3>
        <button onClick={() => navigate(`/project/${slug}/detail`)}>
          View
        </button>
      </div>
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
        <div className="reward">
          <span>
            <PngIconGiftBox /> Reward: {getTaskRewardTypeLabel(reward)}
          </span>
        </div>
        <hr />
        {/* <h4>{info?.description || 'Task Statements'}</h4> */}
        <h4>{'Task Statements'}</h4>

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
    <div className="item">
      {/* <IconCheckbox /> */}
      <span></span>
      {content}
    </div>
  );
}

const TaskTitleBox = styled.div`
  /* height: 411px; */
  line-height: 20px;
  background: #fffbdb;
  padding: 20px;

  & .title {
    display: flex;
    justify-content: space-between;
    & h3 {
      font-weight: 700;
      font-size: 20px;
      line-height: 30px;
      color: #333333;
    }
    & button {
      width: 106px;
      height: 40px;
      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      color: #ffffff;
    }
  }

  & h4 {
    margin-bottom: 0;
    font-weight: 700;
    font-size: 14px;
    line-height: 21px;
    color: #333333;
  }

  & hr {
    border-color: rgba(51, 51, 51, 0.2);
    margin: 10px 0;
  }

  & .reward,
  & .alarm-clock {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    color: #333333;
    margin-top: 10px;
    > span {
      & img {
        height: 20px;
        margin-right: 5px;
      }
      height: 29px;

      border-radius: 20px;
      margin: 0;
      display: flex;
      align-items: center;

      font-weight: 700;
      font-size: 14px;
      line-height: 21px;
      color: #333333;
    }
  }
  & .alarm-clock {
    > span {
      background: #d3ed85;
      padding: 2px 10px;
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

      & span {
        display: inline-block;
        background: #000;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 15px;
      }
    }
  }
`;
