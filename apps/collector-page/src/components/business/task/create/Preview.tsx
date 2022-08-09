import { Box, Modal } from '@mui/material'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { ActionType, RewardType, State } from './state'
import { ChainType, selectAccount } from '../../../../features/user/accountSlice'
import { useAppSelector } from '../../../../store/hooks'
import IconTip from '../../../common/icons/IconTip'
import IconDiscord from '../../../common/icons/IconDiscord'
import IconNotify from '../../../common/icons/IconNotify'
import IconTwitter from '../../../common/icons/IconTwitter'
import { AsyncRequestStatus } from '../../../../types'

import ButtonNavigation from '../../../common/button/ButtonNavigation'
import dayjs from 'dayjs'
import IconCheckbox from '../../../common/icons/IconCheckbox'
import IconGiftBox from '../../../common/icons/IconGiftBox'
import IconAlarmClock from '../../../common/icons/IconAlarmClock'
import PngIconCaretLeft from '../../../common/icons/PngIconCaretLeft'

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
  console.log(state)
  return (
    <TaskPrevewWrapper style={{ display: open ? '' : 'none' }}>
      <div className="tint">
        <p> Please check the event page carefully as it cannot be edited once submitted.</p>
      </div>
      <div className="container">
        <div className="back-btn" onClick={closeHandler}>
          <ButtonNavigation>
            <PngIconCaretLeft />
          </ButtonNavigation>
        </div>
        <div className="title">
          <h3>{state.name}</h3>
        </div>
        <div className="project">Project:{state.projectName}</div>
        <div className="img">
          <img src={state.image} alt="" />
        </div>
        <div className="infos">
          <div className="left">
            <h3>{state.type} Task</h3>
            <div>
              <IconAlarmClock />
              <span>
                {dayjs(state.startTime).format('YYYY/MM/DD')}——{dayjs(state.endTime).format('YYYY/MM/DD')}
              </span>
              <span>Winners: {state.winnerNum}</span>
            </div>
            <div>
              <IconGiftBox />
              <span>Reward: {state.reward.type === RewardType.WHITELIST ? 'whitelist' : state.reward.name}</span>
            </div>
            <div className="desc">{state.description}</div>
          </div>
          <div className="right">
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
                <div key={idx} className="action-item">
                  <IconCheckbox></IconCheckbox> <p>{item.name}</p> <Icon />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="submit-btn">
        <button onClick={submitResult}>Submit</button>
      </div>
    </TaskPrevewWrapper>
  )
}

const TaskPrevewWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 20px;
  background-color: #fff;
  box-sizing: border-box;

  & .tint {
    height: 50px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fffbdb;
    & p {
      margin: 0;
      font-size: 16px;
      line-height: 24px;
      color: #333333;
      font-weight: 400;
    }
  }

  & .container {
    position: relative;
    padding: 40px 110px;
    & .back-btn {
      position: absolute;
      left: 40px;
    }

    & .title {
      h3 {
        margin: 5px 0;
        font-weight: 700;
        font-size: 36px;
        line-height: 40px;
        color: #333333;
      }
    }

    & .project {
      margin: 14px 0;
      font-weight: 400;
      font-size: 20px;
      line-height: 30px;
      color: #3dd606;
    }

    & .img > img {
      width: 100%;
    }

    & .infos {
      margin-top: 26px;
      display: flex;
      > div {
        flex-grow: 1;
      }

      > div.left {
        & h3 {
          margin: 0;
        }
        > div {
          margin: 10px 0;
          height: 21px;
          color: #333333;
          display: flex;
          align-items: center;

          > span {
            display: inline-block;
            width: 50%;
            margin: 0 5px;
            font-weight: 400;
            font-size: 14px;
            line-height: 21px;
          }
        }

        & .desc {
          font-weight: 400;
          font-size: 14px;
          line-height: 21px;

          color: rgba(51, 51, 51, 0.6);
        }
      }

      > div.right {
        background-color: #f8f8f8;
        padding: 20px;
        & .action-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          & p {
            margin: 0;
            margin-left: 10px;
            flex-grow: 1;
          }
        }
        & .action-item:last-child {
          margin: 0;
        }
      }

      & h3 {
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;

        color: #333333;
      }
    }
  }

  & .submit-btn {
    position: sticky;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    height: 68px;
    background: #ffffff;
    box-shadow: 0px -4px 0px rgba(0, 0, 0, 0.25);
    & button {
      cursor: pointer;
      border: none;
      outline: none;
      background-color: #3dd606;
      color: #fff;
      width: 200px;
      height: 48px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
    }
  }
`
