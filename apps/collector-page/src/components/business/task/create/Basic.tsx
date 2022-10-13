import AddIcon from '@mui/icons-material/Add'
import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import * as dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { RewardType, State } from './state'
import { uploadImage as uploadImageApi } from '../../../../services/api/login'
import { TASK_IMAGE_SIZE_LIMIT } from '../../../../constants'
import { Box, Modal, CircularProgress } from '@mui/material'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: '10px',
  textAlign: 'center',
  outline: 'none',
}

export default function Basic({ state, updateState }: { state: State; updateState: (arg0: State) => void }) {
  const [modalOpen, setModalOpen] = useState(false)

  const uploadImageHandler = useCallback(
    async (e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return
      if ((file as File).size > TASK_IMAGE_SIZE_LIMIT) {
        toast.error('File Too Large. 1M Limit')
        return
      }
      setModalOpen(true)
      try {
        const { data } = await uploadImageApi(file)
        updateState({
          ...state,
          image: data.url,
        })
        e.target.value = null
        toast.success('upload success')
      } catch (error) {
        toast.error('upload fail')
      } finally {
        setModalOpen(false)
      }
    },
    [state, updateState],
  )

  function numberInput(e) {
    if (e.charCode < 48 || e.charCode > 57) {
      e.preventDefault()
    }
  }

  return (
    <>
      <BasicBox>
        <div className="information">
          <div className="subtitle">
            <span>Information</span>
          </div>
          <div className="content">
            <div>
              <div className="content-item">
                <h4>Task title</h4>
                <input
                  title="task-title"
                  placeholder="At least 4 characters"
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
                  placeholder="Input"
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
            <div className="attach-file">
              <h4>Task banner (640 * 300)</h4>
              <input
                title="task-banner"
                id="task-banner"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={uploadImageHandler}
              />
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
                  {(state.reward.raffled &&
                    'Raffle task, the task will automatically close once it winners complete the task.') ||
                    'FCFS task, we will randomly select  winners for you upon closing the task.'}
                </p>
              </div>
              <div className="content-item">
                <h4>Total winners</h4>
                <input
                  title="total-winners"
                  type={'number'}
                  min={'0'}
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
                          name: '',
                          type: RewardType.WHITELIST,
                        },
                      })
                    }}
                  >
                    Whitelist
                  </button>
                  <button
                    className={state.reward.type === RewardType.OTHERS ? 'active' : ''}
                    onClick={() => {
                      updateState({
                        ...state,
                        reward: {
                          ...state.reward,
                          type: RewardType.OTHERS,
                        },
                      })
                    }}
                  >
                    Other
                  </button>
                  <button
                    className={state.reward.type === RewardType.CONTRIBUTION_TOKEN ? 'active' : ''}
                    onClick={() => {
                      updateState({
                        ...state,
                        reward: {
                          ...state.reward,
                          name: '',
                          type: RewardType.CONTRIBUTION_TOKEN,
                        },
                      })
                    }}
                  >
                    Contribution Scores
                  </button>
                </div>
                {state.reward.type === RewardType.OTHERS && (
                  <input
                    type="text"
                    title="reward-others-name"
                    placeholder={state.reward.type === RewardType.OTHERS ? 'Name' : ''}
                    value={state.reward.name}
                    onChange={(e) => {
                      updateState({
                        ...state,
                        reward: {
                          ...state.reward,
                          name: e.target.value,
                        },
                      })
                    }}
                  />
                )}
                {state.reward.type === RewardType.CONTRIBUTION_TOKEN && (
                  <input
                    type="number"
                    title="reward-others-name"
                    value={
                      state.reward.token_num
                        ? state.reward.token_num === 0
                          ? ''
                          : state.reward.token_num.toString()
                        : ''
                    }
                    onChange={(e) => {
                      const num = Number(e.target.value)
                      updateState({
                        ...state,
                        reward: {
                          ...state.reward,
                          token_num: num,
                        },
                      })
                    }}
                  />
                )}
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

      <Modal open={modalOpen}>
        <Box sx={{ ...style }}>
          <CircularProgress size="6rem" color="inherit" />
          <p>Uploading Image</p>
        </Box>
      </Modal>
    </>
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
        border-radius: 10px;
        overflow: hidden;
        border: 4px solid #333333;
        & button {
          border: none;
          outline: none;
          background: #f7f9f1;
          border-radius: 0;
          font-size: 18px;
          line-height: 27px;
          width: 33%;
          height: 50px;
          cursor: pointer;
        }
        & button:nth-child(2) {
          border-left: 4px solid #333333;
          border-right: 4px solid #333333;
          width: 34%;
        }
        & button.active {
          background: #333333;
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
          border-radius: 25px;
          background: #ebeee4;
          transition: all 0.1s ease-out;
          box-sizing: border-box;
          & > span {
            cursor: pointer;
            display: inline-block;
            position: absolute;
            left: 5px;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            background-color: #fff;
            transition: all 0.1s ease-out;
          }
          &.active {
            background-color: #3dd606;
            & > span {
              left: 55px;
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
    font-family: inherit;
    background-color: #f8f8f8;
    border: none;
    outline: none;
    padding: 12px 20px;
    font-size: 18px;
    line-height: 27px;
    background: #ebeee4;
    border-radius: 10px;
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
      background: #ebeee4;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 253px;
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
