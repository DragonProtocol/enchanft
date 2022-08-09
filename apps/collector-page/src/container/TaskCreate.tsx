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
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import Basic from '../components/business/task/create/Basic'
import Preview from '../components/business/task/create/Preview'
import SelectActions from '../components/business/task/create/SelectAction'
import { State as CreateTaskState, DefaultState } from '../components/business/task/create/state'
import ButtonNavigation from '../components/common/button/ButtonNavigation'
import IconCaretLeft from '../components/common/icons/IconCaretLeft'
import { TASK_DEFAULT_IMAGE_URLS } from '../constants'
import { createTask, selectTaskDetail } from '../features/task/taskDetailSlice'
import { RoleType, selectAccount } from '../features/user/accountSlice'
import usePermissions from '../hooks/usePermissons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { AsyncRequestStatus } from '../types'

export default function TaskCreate() {
  const navigate = useNavigate()
  const { projectId, projectName } = useParams()
  const [openPreview, setOpenPreview] = React.useState(false)
  const [toastMsg, setToastMsg] = React.useState('')
  const [showToast, setShowToast] = React.useState(false)
  const [refreshAction, setRefreshAction] = React.useState(0)
  const [state, setState] = useState<CreateTaskState>({
    ...DefaultState,
    projectId: Number(projectId),
    projectName: projectName || '',
  })
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
      {(!openPreview && (
        <TaskCreateWrapper>
          <div className="infos">
            <div className="title">
              <ButtonNavigation onClick={() => navigate(-1)}>
                <IconCaretLeft />
              </ButtonNavigation>
              <h3>Create a new Task</h3>
            </div>
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
            <div className="preview-box">
              <button
                className="preview-btn"
                onClick={() => {
                  if (!state.image) {
                    const random = Math.floor(Math.random() * TASK_DEFAULT_IMAGE_URLS.length)
                    setState({
                      ...state,
                      image: TASK_DEFAULT_IMAGE_URLS[random],
                    })
                  }
                  setOpenPreview(true)
                }}
              >
                View
              </button>
            </div>
          </div>
        </TaskCreateWrapper>
      )) || (
        <Preview
          state={state}
          open={openPreview}
          closeHandler={() => setOpenPreview(false)}
          submitResult={submitResult}
        />
      )}
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
  padding: 40px;
  background-color: #fff;
  box-sizing: border-box;

  & > div.infos {
    & .title {
      display: flex;
      align-items: center;
      & h3 {
        margin: 0;
        height: 40px;
        line-height: 40px;
        font-size: 36px;
        margin-left: 20px;
      }
    }

    & .subtitle {
      margin-top: 40px;
      border-bottom: 1px solid #d9d9d9;
      margin-bottom: 10px;
      & span {
        font-weight: 700;
        font-size: 24px;
        line-height: 40px;
        border-bottom: 4px solid #3dd606;
      }
    }
  }

  & h4 {
    height: 27px;
    line-height: 27px;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 0;
    margin-top: 20px;
  }

  & .preview-box {
    text-align: end;
    & button.preview-btn {
      cursor: pointer;
      margin-top: 20px;
      width: 200px;
      background-color: #3dd606;
      color: #fff;
      border: none;
      height: 48px;
      font-size: 20px;
      box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    }
  }
`
