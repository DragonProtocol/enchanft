import { Button } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { ScheduleInfo, Winner } from '../../../features/creator'
import { sortPubKey } from '../../../utils/solana'

export enum TaskStatus {
  SUBMIT,
  START,
  END,
  CLOSE,
}

export default function WinnerList({
  winnersNum,
  winnerList,
  schedules,
  uploadSelected,
  whitelistSaved,
  downloadWinners,
}: {
  winnersNum: number
  whitelistSaved: boolean
  winnerList: Array<Winner>
  schedules: ScheduleInfo | null
  uploadSelected: (arg0: Array<number>) => void
  downloadWinners: () => void
}) {
  // const list: Array<number> = new Array(20).fill('').map((item, index) => index)
  const list = winnerList

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
      result.push(item.id)
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
        {(whitelistSaved && (
          <div>
            <Button variant="outlined" onClick={downloadWinners}>
              Download
            </Button>
          </div>
        )) || (
          <div>
            <Button variant="outlined" onClick={genRandom}>
              Random
            </Button>
            {'  '}
            <Button
              variant="outlined"
              onClick={() => {
                uploadSelected(selected)
              }}
            >
              Save {selected.length}
            </Button>
          </div>
        )}
      </div>
      <div className="list">
        {list.map((item, idx) => {
          return (
            <ListItem
              key={idx}
              idx={idx}
              data={item}
              selected={selected}
              disableSelect={disableSelect}
              setSelected={(newSelected) => {
                setDisableSelect(newSelected.length >= winnersNum)
                setSelected(newSelected)
              }}
              showSelect={!whitelistSaved}
            />
          )
        })}
      </div>
    </WinnerListBox>
  )
}

function ListItem({
  idx,
  data,
  disableSelect,
  selected,
  setSelected,
  showSelect,
}: {
  idx: number
  data: Winner
  disableSelect: boolean
  showSelect: boolean
  selected: Array<number>
  setSelected: (arg0: Array<number>) => void
}) {
  return (
    <div>
      <span style={{ width: '20px' }}>{idx}</span>
      <span>
        <img src={data.avatar} alt="" />
      </span>
      <span>{data.name}</span>
      <span>{data.pubkey}</span>
      {(showSelect && (
        <Checkbox
          checked={selected.includes(data.id)}
          disabled={disableSelect && !selected.includes(data.id)}
          onChange={() => {
            if (selected.includes(data.id)) {
              const newArr = selected.filter((item) => {
                return item !== data.id
              })
              setSelected(newArr)
            } else {
              selected.push(data.id)
              setSelected([...selected])
            }
          }}
        />
      )) || <span>{'  '}</span>}
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
