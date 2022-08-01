import { Button } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { PickedWhiteList, ScheduleInfo, Winner } from '../../../features/creator'
import { sortPubKey } from '../../../utils/solana'
import CardBox from '../../common/card/CardBox'

export enum TaskStatus {
  SUBMIT,
  START,
  END,
  CLOSE,
}

export default function WinnerList({
  winnersNum,
  winnerList,
  pickedWhiteList,
  schedules,
  uploadSelected,
  whitelistSaved,
  downloadWinners,
}: {
  winnersNum: number
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
    <WinnerListBox>
      <div className="title">
        <h3>Winner List</h3>
        {(whitelistSaved && (
          <div>
            <CustomBtn variant="outlined" onClick={downloadWinners}>
              Download
            </CustomBtn>
          </div>
        )) || (
          <div>
            <CustomBtn variant="outlined" onClick={genRandom}>
              Random
            </CustomBtn>
            {'  '}
            <CustomBtn
              variant="outlined"
              onClick={() => {
                uploadSelected(selected)
              }}
            >
              Save {selected.length}
            </CustomBtn>
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
                setDisableSelect(newSelected.length >= winnersNum)
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
      <div>
        <span className="index">{idx}</span>
        <span>
          <img src={data.avatar} alt="" />
        </span>
        <span className="name">{data.name}</span>
        <span>{data.pubkey}</span>
      </div>
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

const CustomBtn = styled(Button)`
  color: #3dd606;
  border-color: #3dd606;
  &:hover {
    border-color: #3dd606;
  }
`

const WinnerListBox = styled(CardBox)`
  margin-top: 25px;

  & .title {
    display: flex;
    justify-content: space-between;

    & h3 {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #333333;
    }
  }

  & .list {
    background: #f8f8f8;
    padding: 20px;
    margin-top: 20px;
    & > div {
      font-weight: 400;
      font-size: 10px;
      line-height: 20px;
      color: #333333;
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #d9d9d9;
      &:first-child {
        border-top: 1px solid #d9d9d9;
      }
      & > div {
        display: flex;
        & img {
          width: 40px;
          height: 40px;
        }

        & .index {
          width: 60px;
        }

        & .name {
          width: 80px;
          margin: 0 10px;
        }
      }

      & span {
        font-size: 16px;
        display: flex;
        align-items: center;
        padding-right: 0;
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
