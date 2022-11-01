import React from 'react';
import styled from 'styled-components';
// import CardBox from '../../common/card/CardBox'

export default function Dashboard({
  participants,
  winners,
  completionRate,
}: {
  participants: number;
  winners: number;
  completionRate: string;
}) {
  return (
    <TaskDashboardBox>
      <h3>Task Dashboard</h3>
      <div className="cards">
        <Card title={'Participants'} num={participants} />
        <Card title={'Entries'} num={winners} />
        <Card title={'Completion Rate'} num={completionRate} percent />
      </div>
    </TaskDashboardBox>
  );
}

function Card({
  title,
  num,
  percent,
}: {
  title: string;
  num: number | string;
  percent?: boolean;
}) {
  return (
    <div>
      <p>{title}</p>
      <p className="num">
        {num.toLocaleString()}
        {percent && '%'}
      </p>
    </div>
  );
}

const TaskDashboardBox = styled.div`
  box-sizing: border-box;
  & h3 {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #333333;
  }

  & > .cards {
    display: flex;
    margin-top: 22px;
    justify-content: space-between;
    & > div {
      width: 220px;
      height: 100px;
      background: #ebeee4;
      border-radius: 10px;
      text-align: center;
      padding: 24px 5px;
      box-sizing: border-box;
      & p {
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        text-align: center;
        color: #333333;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      & .num {
        font-weight: 700;
        font-size: 24px;
        line-height: 36px;
        text-align: center;
        color: #333333;
        width: initial;
        display: block;
      }
    }
  }
`;
