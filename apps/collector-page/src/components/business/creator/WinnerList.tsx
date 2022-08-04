import { Button } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { PickedWhiteList, ScheduleInfo, Winner } from '../../../features/creator'
import { sortPubKey } from '../../../utils/solana'
import UserAvatar from '../user/UserAvatar'

export enum TaskStatus {
  SUBMIT,
  START,
  END,
  CLOSE,
}

export default function WinnerList({
  winnerNum,
  winnerList,
  pickedWhiteList,
  schedules,
  uploadSelected,
  whitelistSaved,
  downloadWinners,
}: {
  winnerNum: number
  whitelistSaved: boolean
  winnerList: Array<Winner>
  pickedWhiteList: Array<PickedWhiteList>
  schedules: ScheduleInfo | null
  uploadSelected: (arg0: Array<number>) => void
  downloadWinners: () => void
}) {
  // const list: Array<number> = new Array(20).fill('').map((item, index) => index)
  const list = winnerList

  const [selected, setSelected] = useState<Array<number>>([])
  const [disableSelect, setDisableSelect] = useState(false)

  const genRandom = useCallback(() => {
    let num = winnerNum
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
  }, [list, winnerNum])

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
          const checked = whitelistSaved
            ? pickedWhiteList.find((pickedItem) => pickedItem.user_id == item.id)
            : selected.includes(item.id)
          const disabled = whitelistSaved || (disableSelect && !selected.includes(item.id))
          return (
            <ListItem
              key={idx}
              idx={idx}
              data={item}
              checked={!!checked}
              disabled={disabled}
              selected={selected}
              setSelected={(newSelected) => {
                setDisableSelect(newSelected.length >= winnerNum)
                setSelected(newSelected)
              }}
              couldSelect={!whitelistSaved}
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
  checked,
  disabled,
  selected,
  setSelected,
  couldSelect,
}: {
  idx: number
  data: Winner
  checked: boolean
  disabled: boolean
  couldSelect: boolean
  selected: Array<number>
  setSelected: (arg0: Array<number>) => void
}) {
  return (
    <div>
      <span style={{ width: '20px' }}>{idx}</span>
      <span>
        <UserAvatar src={data.avatar} />
      </span>
      <span>{data.name}</span>
      <span>{data.pubkey}</span>
      <Checkbox
        checked={checked}
        disabled={disabled}
        onChange={() => {
          if (!couldSelect) return
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
