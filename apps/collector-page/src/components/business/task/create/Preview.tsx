import { Box, Modal } from '@mui/material'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { ActionType, State } from './state'
import { ChainType, selectAccount } from '../../../../features/user/accountSlice'
import { useAppSelector } from '../../../../store/hooks'
import IconTip from '../../../common/icons/IconTip'
import IconDiscord from '../../../common/icons/IconDiscord'
import IconNotify from '../../../common/icons/IconNotify'
import IconTwitter from '../../../common/icons/IconTwitter'
import { AsyncRequestStatus } from '../../../../types'

export default function Preview({
  state,
  open,
  closeHandler,
  submitResult,
}: {
  state: State
  open: boolean
  closeHandler: () => void
  submitResult: () => void
}) {
  const account = useAppSelector(selectAccount)

  return (
    <Modal
      open={open}
      onClose={closeHandler}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          maxHeight: 'calc(100% - 100px)',
          bgcolor: 'background.paper',
          overflow: 'scroll',
          boxShadow: 24,
          p: 4,
        }}
      >
        <ModalViewBox>
          <h3>{state.name}</h3>
          <p>{account.name}</p>
          <div className="attach-file">
            {(state.image && <img src={state.image} alt="" />) || <div className="">400 x 600</div>}
          </div>
          <p>{state.reward.raffled ? 'Winner-Luck-Draw' : 'Winner-Oriented'} Task</p>
          <p>Reward: {state.reward.type.toLowerCase()}</p>
          <p>winners: {state.winnerNum}</p>
          <p>
            {new Date(state.startTime).toLocaleDateString()} — {new Date(state.endTime).toLocaleDateString()}
          </p>
          <p>{state.description}</p>
          <h4>{`Take the task`}</h4>
          <ul>
            {state.actions.map((item, idx) => {
              let Icon
              if (item.type === ActionType.DISCORD) {
                Icon = IconDiscord
              }
              if (item.type === ActionType.TWITTER) {
                Icon = IconTwitter
              }
              if (item.type === ActionType.NOTIFY) {
                Icon = IconNotify
              }
              if (item.type === ActionType.UNKNOWN) {
                Icon = IconTip
              }
              return (
                <li key={idx} className="action-item">
                  <p>{item.name}</p> <Icon />
                </li>
              )
            })}
          </ul>

          <button onClick={submitResult}>submit</button>
        </ModalViewBox>
      </Box>
    </Modal>
  )
}
const ModalViewBox = styled.div`
  font-size: 20px;
  position: relative;
  & h3 {
    margin: 0;
    font-size: 28px;
  }

  & img {
    width: 100%;
  }

  & h4 {
    margin: 0;
    text-align: center;
    background-color: #000;
    color: #fff;
    padding: 10px 0;
    margin-bottom: 10px;
  }
  & ul {
    margin: 0;
    padding: 0 20px;

    & .action-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      & p {
        position: relative;
        margin: 5px;

        &::before {
          content: '';
          position: absolute;
          width: 15px;
          height: 15px;
          left: -25px;
          top: 8px;
          background-color: #000;
          border-radius: 50%;
        }
      }
    }
  }

  & .attach-file {
    > div {
      color: rgba(153, 154, 154, 100);
      padding: 10px 0;
    }
    > label {
      padding: 5px 8px;
      background-color: rgba(164, 173, 179, 100);
    }

    > #task-banner {
      display: none;
    }
  }

  & button {
    cursor: pointer;
    margin-top: 20px;
    width: 100%;
    background-color: #000;
    color: #fff;
    border: none;
    height: 50px;
    font-size: 20px;
  }
`
