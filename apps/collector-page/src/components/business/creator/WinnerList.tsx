import { Box, Button, ButtonBase, Modal, Typography } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { PickedWhiteList, ScheduleInfo, Winner } from '../../../features/creator'
import { sortPubKey } from '../../../utils/solana'
import UserAvatar from '../user/UserAvatar'
import CardBox from '../../common/card/CardBox'
import CrownImg from '../../imgs/crown.svg'
import IconCheckboxChecked from '../../common/icons/IconCheckboxChecked'
import IconCheckbox from '../../common/icons/IconCheckbox'
import { RewardType } from '../task/create/state'
import { getTaskRewardTypeLabel } from '../../../utils/task'

export enum TaskStatus {
  SUBMIT,
  START,
  END,
  CLOSE,
}

const ModalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '10px',
  p: 2,
}

export default function WinnerList({
  reward,
  winnerNum,
  winnerList,
  candidateList,
  pickedWhiteList,
  schedules,
  uploadSelected,
  whitelistSaved,
  downloadWinners,
}: {
  reward: { raffled: boolean; type: RewardType }
  winnerNum: number
  whitelistSaved: boolean
  winnerList: Array<Winner>
  candidateList: Array<Winner>
  pickedWhiteList: Array<PickedWhiteList>
  schedules: ScheduleInfo | null
  uploadSelected: (arg0: Array<number>) => void
  downloadWinners: () => void
}) {
  const [activeList, setActiveList] = useState('entry')
  const [selected, setSelected] = useState<Array<number>>([])
  const [disableSelect, setDisableSelect] = useState(false)

  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  const genRandom = useCallback(() => {
    let tmpList = [...winnerList]
    let num = Math.min(winnerNum, tmpList.length)
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
  }, [winnerList, winnerNum])

  const dateNow = new Date()
  const schedulesEndTime = schedules?.endTime ? new Date(schedules?.endTime) : dateNow

  return (
    <>
      <WinnerListBox>
        <div className="title">
          {(whitelistSaved && (
            <h3>
              <span
                className={(activeList === 'entry' && 'active') || ''}
                onClick={() => {
                  setActiveList('entry')
                }}
              >
                Entry List
              </span>
              {reward.raffled && (
                <span
                  className={(activeList === 'candidate' && 'active') || ''}
                  onClick={() => {
                    setActiveList('candidate')
                  }}
                >
                  Participants List
                </span>
              )}
            </h3>
          )) || (
            <h3>
              <span className="active">Entry List</span>
            </h3>
          )}
          {(whitelistSaved && (
            <div>
              <CustomBtn onClick={downloadWinners}>Download</CustomBtn>
            </div>
          )) || (
            <>
              {(reward.raffled && null) ||
                (dateNow > schedulesEndTime && (
                  <div>
                    <CustomBtn onClick={genRandom}>Randomly</CustomBtn>
                    {'  '}
                    <CustomBtn
                      onClick={() => {
                        setConfirmModalOpen(true)
                      }}
                    >
                      Entries {selected.length}
                    </CustomBtn>
                  </div>
                ))}
            </>
          )}
        </div>
        {(activeList == 'entry' && (
          <div className="list">
            {winnerList.map((item, idx) => {
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
                  couldSelect={
                    getTaskRewardTypeLabel(reward) != 'FCFS' ? !whitelistSaved || dateNow > schedulesEndTime : false
                  }
                />
              )
            })}
          </div>
        )) || (
          <div className="list">
            {candidateList.map((item, idx) => {
              return <PickedList key={idx} idx={idx} data={item} />
            })}
          </div>
        )}
      </WinnerListBox>

      <ConfirmModal
        open={confirmModalOpen}
        // onClose={() => setConfirmModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <Typography className="desc" sx={{ mt: 2 }}>
            You cannot change once confirmed
          </Typography>

          <ModalBtnBox>
            <button
              className="cancel"
              onClick={() => {
                setConfirmModalOpen(false)
              }}
            >
              Cancel
            </button>
            <button
              className="confirm"
              onClick={() => {
                uploadSelected(selected)
                setConfirmModalOpen(false)
              }}
            >
              Confirm
            </button>
          </ModalBtnBox>
        </Box>
      </ConfirmModal>
    </>
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
        <span className={idx < 3 ? 'index front-3' : 'index'}>{idx + 1}</span>
        <span>
          <UserAvatar src={data.avatar} multiavatarId={data.pubkey || data.name} />
        </span>
        <span className="name">{data.name}</span>
        <span className="pubkey">{sortPubKey(data.pubkey, 16)}</span>
      </div>
      {couldSelect && (
        <CustomCheckBox
          checked={checked}
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
      )}
    </div>
  )
}

function PickedList({ idx, data }: { idx: number; data: any }) {
  return (
    <div>
      <div>
        <span className={idx < 3 ? 'index front-3' : 'index'}>{idx + 1}</span>
        <span>
          <UserAvatar src={data.avatar} multiavatarId={data.pubkey || data.name} />
        </span>
        <span className="name">{data.name}</span>
        <span className="pubkey">{sortPubKey(data.pubkey, 16)}</span>
      </div>
    </div>
  )
}

function CustomCheckBox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <span
      onClick={() => {
        onChange()
      }}
    >
      {checked ? <IconCheckboxChecked /> : <IconCheckbox />}
    </span>
  )
}

const ConfirmModal = styled(Modal)`
  & .desc {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
  }

  & .err-msg {
    color: red;
  }
`

const CustomBtn = styled.button`
  padding: 10px 18px;
  border-radius: 20px;
  background: #ebeee4;
  box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
  outline: none;
  border: none;
`

const ModalBtnBox = styled.div`
  display: flex;
  justify-content: end;

  & button {
    cursor: pointer;
    background: #f8f8f8;
    margin-top: 20px;
    padding: 0 20px;
    border: none;
    height: 48px;
    font-size: 20px;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
  }

  & button.confirm {
    background-color: #3dd606;
    margin-left: 20px;
    color: #fff;
  }
`

const WinnerListBox = styled(CardBox)`
  margin-top: 25px;
  background: #f7f9f1;
  & .title {
    display: flex;
    justify-content: space-between;

    & h3 {
      border-radius: 10px;
      overflow: hidden;
      border: 2px solid #333333;
      height: 50px;
      box-sizing: border-box;
      & span {
        text-align: center;
        display: inline-block;
        padding: 10px;
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        width: 180px;
        background-color: #f7f9f1;
        color: #333333;
        cursor: pointer;

        &.active {
          color: #ffffff;
          background-color: #333333;
        }
      }
    }

    > div {
      display: flex;
      align-items: center;
      > button {
        border-radius: 10px;
        font-weight: 700;
        font-size: 14px;
        line-height: 21px;
        color: #333333;
        cursor: pointer;
        &:first {
          margin: 0 10px;
        }
      }
    }
  }

  & .list {
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
      &:last-child {
        border-bottom: none;
      }
      & > div {
        display: flex;
        align-items: center;
        & img {
          width: 40px;
          height: 40px;
        }

        & .index {
          width: 60px;
          margin-right: 20px;
        }

        & .name {
          width: 120px;
          margin: 0 10px;
          font-weight: 700;
          font-size: 16px;
          line-height: 20px;
          color: #333333;
        }

        & .pubkey {
          font-weight: 400;
          font-size: 16px;
          line-height: 20px;
          color: #333333;
        }
      }

      & span.index {
        height: 24px;
        font-weight: 700;
        text-align: center;
        line-height: 24px;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        text-align: center;
        display: inline-block;
        &.front-3 {
          background-image: url(${CrownImg});
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
