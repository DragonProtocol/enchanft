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
import Basic from '../components/business/task/create/Basic'
import Preview from '../components/business/task/create/Preview'
import SelectActions from '../components/business/task/create/SelectAction'
import { State as CreateTaskState, DefaultState } from '../components/business/task/create/state'

export default function TaskCreate() {
  const [openPreview, setOpenPreview] = React.useState(false)
  const [state, setState] = useState<CreateTaskState>(DefaultState)

  const submitResult = useCallback(() => {}, [])

  return (
    <TaskCreateWrapper>
      <div>
        <h3>Create a new WL task</h3>
        {/* <TextField fullWidth label="fullWidth" id="fullWidth" /> */}
        <div>
          <Basic
            state={state}
            updateState={(newState) => {
              setState({ ...newState })
            }}
          />
          <SelectActions
            updateStateActions={(newStateActions) => {
              setState({ ...state, actions: newStateActions })
            }}
          />
          <div>
            <button onClick={() => setOpenPreview(true)}>view</button>
          </div>
        </div>
      </div>
      <Preview open={openPreview} closeHandler={() => setOpenPreview(false)} submitResult={submitResult} />
    </TaskCreateWrapper>
  )
}

const TaskCreateWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px 0;
  background-color: #fff;
  > div {
    width: 800px;
    margin: 0 auto;
  }

  & h4 {
    margin-bottom: 0;
  }
`
