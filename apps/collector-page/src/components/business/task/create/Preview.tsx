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
import PngIconGiftBox from '../../../common/icons/PngIconGiftBox'
import PngIconAlarmClock from '../../../common/icons/PngIconAlarmClock'
import PngIconCaretLeft from '../../../common/icons/PngIconCaretLeft'
import PngIconWL from '../../../common/icons/PngIconWL'
import { getTaskRewardTypeLabel } from '../../../../utils/task'

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
    <>
      <TaskPrevewWrapper style={{ display: open ? '' : 'none' }}>
        <div className="tint">
          <p> Please check the event page carefully as it cannot be edited once submitted.</p>
        </div>
        <div className="container">
          <div className="title-container" onClick={closeHandler}>
            <ButtonNavigation>
              <PngIconCaretLeft />
            </ButtonNavigation>
            <div className="title">
              <h3>{state.name}</h3>
              <div className="project">Project:{state.projectName}</div>
            </div>
          </div>

          <div className="infos">
            <div className="left">
              <img src={state.image} alt="" />
              <h3>{getTaskRewardTypeLabel({ type: state.reward.type, raffled: state.reward.raffled })}</h3>
              <div className="items">
                <PngIconAlarmClock />
                <span>
                  {dayjs(state.startTime).format('YYYY/MM/DD')}——{dayjs(state.endTime).format('YYYY/MM/DD')}
                </span>
                <span>Winners: {state.winnerNum}</span>
              </div>
              <div className="items">
                <PngIconGiftBox />
                {state.reward.type === RewardType.WHITELIST && <span>Reward: whitelist</span>}
                {state.reward.type === RewardType.OTHERS && <span>Reward: {state.reward.name}</span>}
                {state.reward.type === RewardType.CONTRIBUTION_TOKEN && (
                  <span>Reward: contribution token - {state.reward.token_num}</span>
                )}
              </div>
              <div className="desc">
                <p>{state.description}</p>
              </div>
            </div>
            <div className="right">
              <div>
                <button>Take the Task</button>
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
                    Icon = PngIconWL
                  }
                  return (
                    <div key={idx} className="action-item">
                      <p>{item.name || item.description}</p> <Icon />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </TaskPrevewWrapper>
      <SubmitBtn style={{ display: open ? '' : 'none' }}>
        <div>
          <button onClick={submitResult}>Submit</button>
        </div>
      </SubmitBtn>
    </>
  )
}

const TaskPrevewWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 20px 0 40px 0;
  background: #f7f9f1;
  border: 4px solid #333333;
  border-radius: 20px;
  box-sizing: border-box;
  overflow: hidden;

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
    background: rgba(235, 183, 0, 0.5);
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
    padding: 40px;
    & .back-btn {
      position: absolute;
      left: 40px;
    }

    & .title-container {
      display: flex;
      gap: 20px;

      /* > button {
        border-radius: 10px !important;
      } */
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
      margin-top: 10px;
      display: flex;
      gap: 40px;
      > div {
        flex-grow: 1;
      }

      > div.left {
        & img {
          border-radius: 10px;
          margin-bottom: 26px;
          width: 100%;
          max-height: 300px;
        }
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
          height: auto;
          font-weight: 400;
          font-size: 14px;
          line-height: 21px;

          color: rgba(51, 51, 51, 0.6);

          & > p {
            margin: 0;
            white-space: pre-wrap;
          }
        }
      }

      > div.right,
      > div.left {
        width: 50%;
        box-sizing: border-box;

        & .items {
          & img {
            margin-bottom: 0;
          }
        }
      }
      > div.right {
        > div {
          border-radius: 10px;
          padding: 20px;
          background: #ebeee4;
          border-radius: 10px;
          > button {
            border-radius: 10px;
            background-color: #3dd606;
            box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
            outline: none;
            height: 48px;
            border: none;
            width: 100%;
            font-weight: 700;
            font-size: 18px;
            line-height: 27px;
            color: #ffffff;
            margin-bottom: 20px;
          }
        }

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
`
const SubmitBtn = styled.div`
  left: 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  bottom: 0;
  background: #f7f9f1;
  border-top: 4px solid #333333;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    height: 68px;
    box-shadow: 0px -4px 0px rgba(0, 0, 0, 0.25);
    & button {
      cursor: pointer;
      border: none;
      outline: none;
      background-color: #3dd606;
      color: #fff;
      border-radius: 10px;
      width: 200px;
      height: 48px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
    }
  }
`
