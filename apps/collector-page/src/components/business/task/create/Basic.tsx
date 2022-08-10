import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  Modal,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import * as dayjs from 'dayjs'
import { RewardType, State } from './state'
import { uploadImage as uploadImageApi } from '../../../../services/api/login'

export default function Basic({ state, updateState }: { state: State; updateState: (arg0: State) => void }) {
  const taskBannerRef = useRef<HTMLInputElement>(null)

  const uploadImageHandler = useCallback(
    async (e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return
      const { data } = await uploadImageApi(file)
      updateState({
        ...state,
        image: data.url,
      })
      e.target.value = null
    },
    [state, updateState],
  )

  function numberInput(e) {
    if (e.charCode < 48 || e.charCode > 57) {
      e.preventDefault()
    }
  }

  return (
    <BasicBox>
      <div className="information">
        <div className="subtitle">
          <span>Information</span>
        </div>
        <div className="content">
          <div className="attach-file">
            <h4>Task banner (640 * 300)</h4>
            <input title="task-banner" id="task-banner" type="file" onChange={uploadImageHandler} />
            <div
              onClick={() => {
                document.getElementById('task-banner')?.click()
              }}
            >
              {(state.image && <img src={state.image} alt="" />) || (
                <div className="add-btn">
                  <AddIcon />
                  <br />
                  <span>Attach file</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="content-item">
              <h4>Task title</h4>
              <input
                title="task-title"
                value={state?.name}
                onChange={(e) =>
                  updateState({
                    ...state,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="content-item">
              <h4>Task statement</h4>
              <textarea
                title="task-statement"
                name=""
                id=""
                cols={30}
                rows={10}
                value={state.description}
                onChange={(e) => {
                  updateState({
                    ...state,
                    description: e.target.value,
                  })
                }}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="setting">
        <div className="subtitle">
          <span>Task Setting</span>
        </div>
        <div className="content">
          <div>
            <div className="content-item">
              <h4>Task type</h4>
              {/* <FormControlLabel
                control={
                  <Switch
                    checked={state.reward.raffled}
                    onChange={() => {
                      
                    }}
                  />
                }
                label="Raffle?"
              /> */}
              <div className="raffle-switch-box">
                <span>Raffle:</span>
                <div className={state.reward.raffled ? 'raffle-switch active' : 'raffle-switch'}>
                  <span
                    onClick={() => {
                      updateState({
                        ...state,
                        reward: {
                          ...state.reward,
                          raffled: !state.reward.raffled,
                        },
                      })
                    }}
                  ></span>
                </div>
              </div>
              <p className="type-desc">
                Winner-oriented task, the task will automatically close once it winners complete the task.
              </p>
            </div>
            <div className="content-item">
              <h4>Total winners</h4>
              <input
                title="total-winners"
                onKeyPress={numberInput}
                value={state.winnerNum === 0 ? '' : state.winnerNum.toString()}
                onChange={(e) => {
                  const num = Number(e.target.value)
                  updateState({
                    ...state,
                    winnerNum: num,
                  })
                }}
              />
            </div>
          </div>
          <div>
            <div className="content-item">
              <h4>Reward</h4>
              <div className="reward-btn-group">
                <button
                  className={state.reward.type === RewardType.WHITELIST ? 'active' : ''}
                  onClick={() => {
                    updateState({
                      ...state,
                      reward: {
                        ...state.reward,
                        type: RewardType.WHITELIST,
                      },
                    })
                  }}
                >
                  Whitelist
                </button>
                <button
                  className={state.reward.type === RewardType.OTHER ? 'active' : ''}
                  onClick={() => {
                    updateState({
                      ...state,
                      reward: {
                        ...state.reward,
                        type: RewardType.OTHER,
                      },
                    })
                  }}
                >
                  Other
                </button>
              </div>
              <input
                type="text"
                title="reward-others-name"
                placeholder={state.reward.type === RewardType.OTHER ? 'Name' : ''}
                value={state.reward.name}
                onChange={(e) => {
                  if (state.reward.type === RewardType.OTHER)
                    updateState({
                      ...state,
                      reward: {
                        ...state.reward,
                        name: e.target.value,
                      },
                    })
                }}
              />
            </div>
            <div className="content-item">
              <h4>Task date</h4>
              <div className="date-box">
                <input
                  type="date"
                  title="from-date"
                  className="date"
                  value={dayjs(state.startTime).format('YYYY-MM-DD')}
                  onChange={(e) => {
                    const startTime = dayjs(e.target.value).toDate().getTime()
                    if (startTime > state.endTime) return
                    updateState({
                      ...state,
                      startTime,
                    })
                  }}
                />
                <span />
                <input
                  type="date"
                  title="to-date"
                  className="date"
                  value={dayjs(state.endTime).format('YYYY-MM-DD')}
                  onChange={(e) => {
                    const endTime = dayjs(e.target.value).toDate().getTime()
                    if (endTime < state.startTime) return
                    updateState({
                      ...state,
                      endTime,
                    })
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasicBox>
  )
}

const BasicBox = styled.div`
  & .content {
    display: flex;
    justify-content: space-between;
    > div {
      width: 540px;
    }

    & div.content-item {
      display: flex;
      flex-direction: column;

      & div.date-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        & span {
          display: inline-block;
          width: 10px;
          height: 2px;
          background: black;
        }
        & input.date {
          box-sizing: border-box;
          width: 260px;
        }
      }

      & div.reward-btn-group {
        margin-bottom: 10px;
        & button {
          border: none;
          outline: none;
          background: #f8f8f8;
          border-radius: 0;
          font-size: 18px;
          line-height: 27px;
          width: 50%;
          height: 50px;
        }
        & button.active {
          background: #3dd606;
          color: #fff;
        }
      }

      & p.type-desc {
        font-size: 14px;
        line-height: 21px;
        color: rgba(51, 51, 51, 0.6);
        margin-bottom: 0px;
        margin-top: 10px;
      }

      & div.raffle-switch-box {
        display: flex;
        align-items: center;
        margin-top: 10px;
        > span {
          font-weight: 400;
          font-size: 18px;
          line-height: 27px;
          margin-right: 10px;
        }
        & .raffle-switch {
          display: inline-block;
          position: relative;
          width: 100px;
          height: 50px;
          padding: 5px;
          background-color: #3dd606;
          transition: all 0.1s ease-out;
          box-sizing: border-box;
          & > span {
            cursor: pointer;
            display: inline-block;
            position: absolute;
            left: 55px;
            width: 40px;
            height: 40px;
            background-color: #fff;
            transition: all 0.1s ease-out;
          }
          &.active {
            background-color: #f8f8f8;
            & > span {
              left: 5px;
            }
          }
        }
      }
    }
  }
  & select {
    width: 100%;
  }
  & input,
  & textarea {
    background-color: #f8f8f8;
    border: none;
    outline: none;
    padding: 12px 20px;
    font-size: 18px;
    line-height: 27px;
  }

  & textarea {
    resize: none;
    padding: 12px 20px;
    height: 133px;
  }

  & .attach-file {
    & img {
      width: 100%;
      height: 100%;
    }
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 253px;
      background: #f8f8f8;
      & .add-btn {
        text-align: center;
        & svg {
          width: 40px;
          height: 40px;
        }
      }
    }
    /* > label {
      cursor: pointer;
      padding: 5px 8px;
      background-color: rgba(164, 173, 179, 100);
    } */

    > #task-banner {
      display: none;
    }
  }
`
