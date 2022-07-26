import React from 'react'
import styled from 'styled-components'
import { TaskInfo } from '../../../features/creator'

export default function TaskTitle({ info }: { info: TaskInfo | null }) {
  return (
    <TaskTitleBox className="box">
      <h3>task title</h3>
      <div>
        <p>
          {info?.name} <span style={{ float: 'right' }}>winners {info?.whitelistTotalNum}</span>
        </p>
        <p>
          {info?.startTime && new Date(info?.startTime).toLocaleString()}——
          {info?.endTime && new Date(info?.endTime).toLocaleString()}
        </p>
        <div>
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
    <p>
      <span
        style={{
          display: 'inline-block',
          height: '10px',
          width: '10px',
          background: '#000',
          borderRadius: '50%',
          marginRight: '10px',
        }}
      ></span>
      {content}
    </p>
  )
}

const TaskTitleBox = styled.div`
  width: 421px;
  height: 370px;
  line-height: 20px;
  border-radius: 10px;
  font-size: 14px;
`
