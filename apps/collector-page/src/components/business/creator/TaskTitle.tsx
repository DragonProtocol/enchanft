import React from 'react'
import styled from 'styled-components'
import { TaskInfo } from '../../../features/creator'
import CardBox from '../../common/card/CardBox'
import IconCheckbox from '../../common/icons/IconCheckbox'

export default function TaskTitle({ info }: { info: TaskInfo | null }) {
  return (
    <TaskTitleBox>
      <h3>{info?.name}</h3>
      <div>
        <p></p>
        <p>
          {info?.startTime && new Date(info?.startTime).toLocaleDateString()}—
          {info?.endTime && new Date(info?.endTime).toLocaleDateString()}
          <span style={{ float: 'right' }}>Winners {info?.winnerNum}</span>
        </p>
        <hr />
        <div className="items">
          {info?.actions.map((item, idx) => {
            return <Item key={idx} content={item} />
          })}
        </div>
      </div>
    </TaskTitleBox>
  )
}

function Item({ content }: { content: string }) {
  return (
    <p className="item">
      <IconCheckbox />
      {content}
    </p>
  )
}

const TaskTitleBox = styled(CardBox)`
  width: 420px;
  height: 411px;
  line-height: 20px;
  background: #fffbdb;
  padding: 20px;

  & .items {
    margin-top: 15px;
    & .item {
      display: flex;
      align-items: center;
      margin: 6px 0;
      font-weight: 400;
      font-size: 10px;
      line-height: 20px;
      color: #333333;
      & svg {
        height: 18px;
        width: 18px;
        margin-right: 10px;
      }
    }
  }
`
