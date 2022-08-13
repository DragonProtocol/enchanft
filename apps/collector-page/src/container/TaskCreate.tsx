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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import Basic from '../components/business/task/create/Basic'
import Preview from '../components/business/task/create/Preview'
import SelectActions from '../components/business/task/create/SelectAction'
import { State as CreateTaskState, DefaultState } from '../components/business/task/create/state'
import ButtonNavigation from '../components/common/button/ButtonNavigation'

import { TASK_DEFAULT_IMAGE_URLS } from '../constants'
import { createTask, selectTaskDetail } from '../features/task/taskDetailSlice'
import { RoleType, selectAccount } from '../features/user/accountSlice'
import usePermissions from '../hooks/usePermissons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { AsyncRequestStatus } from '../types'
import PngIconCaretLeft from '../components/common/icons/PngIconCaretLeft'
import { fetchDetail, createTask as createTaskApi, projectBindBot } from '../services/api/task'
import PngIconDone from '../components/common/icons/PngIconDone'

const discordBotCallback = `https://discord.com/oauth2/authorize?client_id=1003616859582627881&permissions=49&scope=bot&response_type=code&redirect_uri=${encodeURI(
  process.env.REACT_APP_DISCORD_CALLBACK_URL!,
)}`

export default function TaskCreate() {
  const navigate = useNavigate()
  const { projectId, projectSlug } = useParams()
  const [searchParams] = useSearchParams()
  const [openPreview, setOpenPreview] = React.useState(false)
  const [toastMsg, setToastMsg] = React.useState('')
  const [showToast, setShowToast] = React.useState(false)

  const [state, setState] = useState<CreateTaskState>({
    ...DefaultState,
    projectId: Number(projectId),
    projectName: searchParams.get('projectName') ? decodeURIComponent(searchParams.get('projectName')!) : '',
  })

  const communityName = searchParams.get('communityName') || ''
  const communityTwitter = searchParams.get('communityTwitter') || ''
  const [hasInviteBot, setHasInviteBot] = React.useState(!!searchParams.get('discordId'))
  // const dispatch = useAppDispatch()
  const { isCreator, checkProjectAllowed } = usePermissions()
  // const { createStatus } = useAppSelector(selectTaskDetail)

  const projectBind = async (guildId: string) => {
    if (!projectId) return
    await projectBindBot({ projectId, discordId: guildId })
    setHasInviteBot(true)
  }

  useEffect(() => {
    localStorage.setItem('discord_guild_id', JSON.stringify({ guildId: null }))
    const handleStorageChange = ({ newValue, key, url }) => {
      if ('discord_guild_id' === key) {
        const { guildId } = JSON.parse(newValue || '{}')
        if (guildId) projectBind(guildId)
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const submitResult = useCallback(async () => {
    try {
      const resp = await createTaskApi(state)
      navigate(`/${projectSlug}/${resp.data.data.id}`)
    } catch (error) {
      setToastMsg('create fail')
      setShowToast(true)
    }
  }, [state])

  if (!isCreator || !checkProjectAllowed(Number(projectId))) {
    return <TaskCreateWrapper>Not allowed</TaskCreateWrapper>
  }

  return (
    <>
      <TaskCreateWrapper style={{ display: openPreview ? 'none' : '' }}>
        <div className="infos">
          <div className="title">
            <ButtonNavigation onClick={() => navigate(-1)}>
              <PngIconCaretLeft />
            </ButtonNavigation>
            <h3>Create a new Task</h3>
          </div>
          <Basic
            state={state}
            updateState={(newState) => {
              setState({ ...newState })
            }}
          />

          <div className="invite-bot">
            <button
              onClick={() => {
                window.open(
                  discordBotCallback,
                  '__blank',
                  `width=480,
          height=800,
          top=0,
          menubar=no,
          toolbar=no,
          status=no,
          scrollbars=no,
          resizable=yes,
          directories=no,
          status=no,
          location=no`,
                )
              }}
            >
              InviteBotToDiscord
            </button>

            {hasInviteBot && <PngIconDone />}
          </div>

          <SelectActions
            hasInviteBot={hasInviteBot}
            updateStateActions={(newStateActions) => {
              setState({ ...state, actions: newStateActions })
            }}
            communityName={communityName}
            communityTwitter={communityTwitter}
            followTwitters={state.followTwitters}
            updateStateFollowTwitters={(data) => {
              setState({ ...state, followTwitters: data })
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

      <Preview
        state={state}
        open={openPreview}
        closeHandler={() => setOpenPreview(false)}
        submitResult={submitResult}
      />

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

  & .invite-bot {
    margin-top: 40px;
    display: flex;
    align-items: center;
    > button {
      background-color: #3dd606;
      border: none;
      outline: none;
      color: #fff;
      width: 200px;
      background-color: #3dd606;
      color: #fff;
      border: none;
      height: 48px;
      font-size: 20px;
    }

    > img {
      width: 30px;
      margin-left: 10px;
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
