import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  Modal,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { InputAdornment } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Basic from '../components/business/task/create/Basic'
import Preview from '../components/business/task/create/Preview'
import SelectActions from '../components/business/task/create/SelectAction'
import { State as CreateTaskState, DefaultState } from '../components/business/task/create/state'
import { createTask, selectTaskDetail } from '../features/task/taskDetailSlice'
import { RoleType, selectAccount } from '../features/user/accountSlice'
import usePermissions from '../hooks/usePermissons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { AsyncRequestStatus } from '../types'

export default function TaskCreate() {
  const { projectId } = useParams()
  const [openPreview, setOpenPreview] = React.useState(false)
  const [toastMsg, setToastMsg] = React.useState('')
  const [showToast, setShowToast] = React.useState(false)
  const [refreshAction, setRefreshAction] = React.useState(0)
  const [state, setState] = useState<CreateTaskState>({ ...DefaultState, projectId: Number(projectId) })
  const dispatch = useAppDispatch()
  const { isCreator, checkProjectAllowed } = usePermissions()
  const { createStatus } = useAppSelector(selectTaskDetail)

  const submitResult = useCallback(() => {
    dispatch(createTask(state))
  }, [state])

  const refreshActionHandler = useCallback(() => {
    setRefreshAction(refreshAction + 1)
  }, [refreshAction])

  useEffect(() => {
    if (createStatus === AsyncRequestStatus.FULFILLED) {
      setOpenPreview(false)
      setState({ ...DefaultState, projectId: Number(projectId) })
      refreshActionHandler()
      setToastMsg('create success')
      setShowToast(true)
    }
    if (createStatus === AsyncRequestStatus.REJECTED) {
      setToastMsg('create failed')
      setOpenPreview(false)
      setShowToast(true)
    }
  }, [createStatus])

  if (!isCreator || !checkProjectAllowed(Number(projectId))) {
    return <TaskCreateWrapper>Not allowed</TaskCreateWrapper>
  }

  return (
    <>
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
              refresh={refreshAction}
              updateStateActions={(newStateActions) => {
                setState({ ...state, actions: newStateActions })
              }}
            />
            <div>
              <button className="preview-btn" onClick={() => setOpenPreview(true)}>
                Preview
              </button>
            </div>
          </div>
        </div>
        <Preview
          state={state}
          open={openPreview}
          closeHandler={() => setOpenPreview(false)}
          submitResult={submitResult}
        />
      </TaskCreateWrapper>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        message={toastMsg}
      />
    </>
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

  & button.preview-btn {
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
