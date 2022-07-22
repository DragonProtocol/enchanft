import { Button } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

export enum TaskStatus {
  BEGIN,
  END,
  PROGRESSING,
  SUBMIT,
  NOTIFY,
}

export default function WinnerList({ taskStatus, winnersNum }: { taskStatus: TaskStatus; winnersNum: number }) {
  const list: Array<number> = new Array(20).fill('').map((item, index) => index)

  const [selected, setSelected] = useState<Array<number>>([])
  const [disableSelect, setDisableSelect] = useState(false)

  const genRandom = useCallback(() => {
    let num = winnersNum
    let tmpList = [...list]
    const result: Array<number> = []
    while (num > 0) {
      const arrLen = tmpList.length
      const randomNum = getRandomInt(0, arrLen)
      const item = tmpList[randomNum]
      result.push(item)
      tmpList = [...tmpList.slice(0, randomNum), ...tmpList.slice(randomNum + 1)]
      num -= 1
    }
    setSelected(result)
    setDisableSelect(true)
  }, [list, winnersNum])

  return (
    <WinnerListBox className="box">
      <div className="title">
        <h3>Winner List</h3>
        <div>
          <Button variant="outlined" onClick={genRandom}>
            Random
          </Button>
          {'  '}
          <Button variant="outlined">Winners {winnersNum - selected.length}</Button>
        </div>
      </div>
      <div className="list">
        {list.map((item, idx) => {
          return (
            <ListItem
              key={idx}
              idx={idx}
              selected={selected}
              disableSelect={disableSelect}
              setSelected={(newSelected) => {
                setDisableSelect(newSelected.length >= winnersNum)
                setSelected(newSelected)
              }}
            />
          )
        })}
      </div>
    </WinnerListBox>
  )
}

function ListItem({
  idx,
  disableSelect,
  selected,
  setSelected,
}: {
  idx: number
  disableSelect: boolean
  selected: Array<number>
  setSelected: (arg0: Array<number>) => void
}) {
  return (
    <div>
      <span style={{ width: '20px' }}>{idx}</span>
      <span>
        <img src="https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk?ext=jpeg" alt="" />
      </span>
      <span>MK·D·Luffy</span>
      <span>3112ASdPyfQFAv..wN3TrWzxiBia6UdqA</span>
      <span>2021-12-12 21:21</span>
      <Checkbox
        checked={selected.includes(idx)}
        disabled={disableSelect && !selected.includes(idx)}
        onChange={() => {
          if (selected.includes(idx)) {
            const newArr = selected.filter((item) => {
              return item !== idx
            })
            setSelected(newArr)
          } else {
            selected.push(idx)
            setSelected([...selected])
          }
        }}
      />
    </div>
  )
}

const WinnerListBox = styled.div`
  margin-top: 25px;

  & .title {
    display: flex;
    justify-content: space-between;
  }

  & .list {
    & > div {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;

      & img {
        width: 40px;
      }

      & span {
        font-size: 16px;
        display: flex;
        align-items: center;
        margin-right: 15px;
        &:last-child {
          font-size: 14px;
          margin: 0px;
        }
      }
    }
  }
`

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}
