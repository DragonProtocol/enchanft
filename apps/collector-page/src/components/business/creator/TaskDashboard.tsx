import React from 'react'
import styled from 'styled-components'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'

export default function TaskDashboard({
  participants,
  winners,
  completionRate,
}: {
  participants: number
  winners: number
  completionRate: number
}) {
  return (
    <TaskDashboardBox className="box">
      <h3>Task Dashboard</h3>
      <div className="cards">
        <Card title={'Participants'} num={participants} />
        <Card title={'Winners'} num={winners} />
        <Card title={'Completion Rate'} num={completionRate} percent />
      </div>
    </TaskDashboardBox>
  )
}

function Card({ title, num, percent }: { title: string; num: number; percent?: boolean }) {
  return (
    <div>
      <p>
        <PeopleOutlineIcon sx={{ mx: 1 }} />
        {title}
      </p>
      <p className="num">
        {num.toLocaleString()}
        {percent && '%'}
      </p>
    </div>
  )
}

const TaskDashboardBox = styled.div`
  height: 239px;

  & > .cards {
    display: flex;
    margin-top: 22px;
    justify-content: space-between;
    & > div {
      width: 217px;
      height: 140px;
      border-radius: 10px;
      /* box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4); */
      border: 1px solid rgba(0, 0, 0, 0.4);
      text-align: center;
      padding: 20px 5px;
      box-sizing: border-box;
      & p {
        height: 29px;
        color: rgba(16, 16, 16, 100);
        font-size: 20px;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      & .num {
        width: 125px;
        height: 40px;
        color: rgba(16, 16, 16, 100);
        font-size: 28px;
        width: initial;
        margin-top: 28px;
        display: block;
      }
    }
  }
`
