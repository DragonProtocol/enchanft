import React from 'react'
import styled from 'styled-components'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import CardBox from '../../common/card/CardBox'

export default function TaskDashboard({
  participants,
  winners,
  completionRate,
}: {
  participants: number
  winners: number
  completionRate: string
}) {
  return (
    <TaskDashboardBox>
      <h3>Task Dashboard</h3>
      <div className="cards">
        <Card title={'Participants'} num={participants} />
        <Card title={'Winners'} num={winners} />
        <Card title={'Completion Rate'} num={completionRate} percent />
      </div>
    </TaskDashboardBox>
  )
}

function Card({ title, num, percent }: { title: string; num: number | string; percent?: boolean }) {
  return (
    <div>
      <p>{title}</p>
      <p className="num">
        {num.toLocaleString()}
        {percent && '%'}
      </p>
    </div>
  )
}

const TaskDashboardBox = styled(CardBox)`
  height: 224px;
  box-sizing: border-box;

  & h3 {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    color: #333333;
  }

  & > .cards {
    display: flex;
    margin-top: 22px;
    justify-content: space-between;
    & > div {
      width: 220px;
      height: 100px;
      background-color: #f8f8f8;
      text-align: center;
      padding: 24px 5px;
      box-sizing: border-box;
      & p {
        color: rgba(16, 16, 16, 100);
        font-weight: 400;
        font-size: 10px;
        line-height: 20px;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      & .num {
        font-weight: 400;
        font-size: 18px;
        line-height: 18px;
        text-align: center;
        color: #3dd606;
        width: initial;
        margin-top: 10px;
        display: block;
      }
    }
  }
`
