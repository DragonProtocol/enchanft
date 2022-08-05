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
import { InputAdornment } from '@mui/material'
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

  return (
    <BasicBox>
      <div>
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
      <div className="attach-file">
        <h4>Task banner</h4>
        {(state.image && (
          <div>
            <img src={state.image} alt="" />
          </div>
        )) || <div className="">400 x 600</div>}
        <label
          htmlFor="task-banner"
          onClick={() => {
            taskBannerRef.current?.select()
          }}
        >
          Attach file
        </label>
        <input ref={taskBannerRef} title="task-banner" id="task-banner" type="file" onChange={uploadImageHandler} />
      </div>
      <div>
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
      <div>
        <h4>Reward</h4>
        <select
          title="reward"
          name=""
          value={state.reward.type}
          onChange={(e) => {
            updateState({
              ...state,
              reward: {
                ...state.reward,
                type: e.target.value as RewardType,
              },
            })
          }}
        >
          <option value={RewardType.WHITELIST}>whitelist</option>
          <option value={RewardType.OTHER}>other</option>
        </select>
        {state.reward.type === RewardType.OTHER && (
          <input
            type="text"
            title="reward-others-name"
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
      </div>
      <div>
        <h4>Task type</h4>
        <FormControlLabel
          control={
            <Switch
              checked={state.reward.raffled}
              onChange={() => {
                updateState({
                  ...state,
                  reward: {
                    ...state.reward,
                    raffled: !state.reward.raffled,
                  },
                })
              }}
            />
          }
          label="Raffle?"
        />
        <p style={{ margin: 0 }}>
          Winner-oriented task, the task will automatically close once it winners complete the task.
        </p>
      </div>
      <div>
        <h4>Total winners</h4>
        <input
          type="number"
          title="total-winners"
          min="1"
          step="1"
          onKeyPress={(e) => e.charCode >= 48 && e.charCode <= 57}
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
      <div>
        <h4>Task date</h4>
        <span>{`from  `}</span>
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
        <span>{`  to  `}</span>
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
    </BasicBox>
  )
}

const BasicBox = styled.div`
  & select {
    width: 100%;
  }
  & input {
    width: calc(100% - 8px);
  }
  & textarea {
    width: calc(100% - 12px);
  }

  & input {
    padding: 2px;
  }

  & textarea {
    resize: none;
    padding: 5px;
  }

  & input.date {
    width: initial;
  }

  & .attach-file {
    & img {
      width: 100%;
    }
    > div {
      color: rgba(153, 154, 154, 100);
      padding: 10px 0;
    }
    > label {
      cursor: pointer;
      padding: 5px 8px;
      background-color: rgba(164, 173, 179, 100);
    }

    > #task-banner {
      display: none;
    }
  }
`
