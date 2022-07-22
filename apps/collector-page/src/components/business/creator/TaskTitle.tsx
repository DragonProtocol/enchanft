import React from 'react'
import styled from 'styled-components'

export default function TaskTitle() {
  return (
    <TaskTitleBox className="box">
      <h3>task title</h3>
      <div>
        <p>
          Whitelist-Oriented Task <span style={{ float: 'right' }}>winners 10</span>
        </p>
        <p>2022/6/22——2022/7/22</p>
        <p>task statements</p>
        <div>
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
        </div>
      </div>
    </TaskTitleBox>
  )
}

function Item() {
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
      Follow @Trippin'Ape Tribe on twitter
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
