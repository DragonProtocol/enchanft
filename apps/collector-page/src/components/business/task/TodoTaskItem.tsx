/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:25:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-26 16:39:23
 * @Description: file description
 */
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Project, TaskTodoCompleteStatus, TaskType, UserActionStatus, Whitelist } from '../../../types/api'
import ButtonBase from '../../common/button/ButtonBase'
import { TaskActionItemDataType } from './TaskActionItem'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import MoodIcon from '@mui/icons-material/Mood'
import MoodBadIcon from '@mui/icons-material/MoodBad'
import TaskActionList from './TaskActionList'

export type TodoTaskItemDataType = {
  id: number
  name: string
  image: string
  whitelistTotalNum: number
  type: TaskType
  projectId: number
  startTime: number
  endTime: number
  description: string
  status: TaskTodoCompleteStatus
  actions: TaskActionItemDataType[]
  project: Project
  whitelist: Whitelist
}

export type TodoTaskItemViewConfigType = {
  displayMint?: boolean
  disabledMint?: boolean
  loadingMint?: boolean
  allowOpenActions?: boolean
  openActions?: boolean
  loadingRefresh?: boolean
}

export type TodoTaskItemDataViewType = {
  data: TodoTaskItemDataType
  viewConfig?: TodoTaskItemViewConfigType
}

export type TodoTaskItemHandlesType = {
  onMint?: (task: TodoTaskItemDataType) => void
  onRefreshTask?: (task: TodoTaskItemDataType) => void
  onTwitter?: (callback: () => void) => void
  onDiscord?: (callback: () => void) => void
}

export type TodoTaskItemProps = TodoTaskItemDataViewType & TodoTaskItemHandlesType

const defaultViewConfig: TodoTaskItemViewConfigType = {
  displayMint: false,
  disabledMint: false,
  loadingMint: false,
  allowOpenActions: false,
  openActions: false,
  loadingRefresh: false,
}
const TaskTodoCompleteStatusView = {
  [TaskTodoCompleteStatus.COMPLETED]: {
    icon: <ThumbUpAltIcon fontSize="small" />,
    text: 'Completed',
  },
  [TaskTodoCompleteStatus.WON]: {
    icon: <MoodIcon fontSize="small" />,
    text: 'Congratulations!',
  },
  [TaskTodoCompleteStatus.LOST]: {
    icon: <MoodBadIcon fontSize="small" />,
    text: 'Sorry',
  },
  [TaskTodoCompleteStatus.CLOSED]: {
    icon: <MoodBadIcon fontSize="small" />,
    text: 'Sorry',
  },
}

const TodoTaskItem: React.FC<TodoTaskItemProps> = ({
  data,
  viewConfig,
  onMint,
  onRefreshTask,
  onTwitter,
  onDiscord,
}: TodoTaskItemProps) => {
  const { name, whitelistTotalNum, type, projectId, startTime, endTime, actions, status, project, whitelist } = data
  const { name: projectName } = project
  const { mintUrl, mintStartTime } = whitelist
  const { disabledMint, displayMint, loadingMint, allowOpenActions, openActions, loadingRefresh } = {
    ...defaultViewConfig,
    ...viewConfig,
  }

  // 根据任务完成状态视图
  const renderTaskStatusContent = () => {
    switch (status) {
      case TaskTodoCompleteStatus.TODO:
      case TaskTodoCompleteStatus.IN_PRGRESS:
        // 计算任务剩余天数
        const remainDays = Math.ceil((endTime - Date.now()) / (1000 * 60 * 60 * 24))
        // 计算所有action，和已完成的action数量
        const allActionNum = actions.length
        const actionDoneNum = actions.filter((action) => action.status === UserActionStatus.DONE).length
        return (
          <TaskProgressBox>
            <ExcessTime>{remainDays} days left</ExcessTime>
            <CompleteNum>{loadingRefresh ? 'Loading...' : `${actionDoneNum}/${allActionNum}`}</CompleteNum>
          </TaskProgressBox>
        )
      case TaskTodoCompleteStatus.COMPLETED:
      case TaskTodoCompleteStatus.WON:
      case TaskTodoCompleteStatus.LOST:
      case TaskTodoCompleteStatus.CLOSED:
        return (
          <Status>
            <StatusIcon>{TaskTodoCompleteStatusView[status].icon}</StatusIcon>
            <StatusText>{TaskTodoCompleteStatusView[status].text}</StatusText>
          </Status>
        )
      default:
        return null
    }
  }

  // mint倒计时
  const [mintStartTimeCountdown, setMintStartTimeCountdown] = useState({
    distance: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  })
  const mintStartTimeCountdownIntervalRef = useRef<any>(null)
  useEffect(() => {
    if (!displayMint) {
      if (mintStartTimeCountdownIntervalRef.current) {
        clearInterval(mintStartTimeCountdownIntervalRef.current)
      }
      return
    }
    mintStartTimeCountdownIntervalRef.current = setInterval(() => {
      const distance = mintStartTime - Date.now()
      const distanceDay = Math.floor(distance / (1000 * 60 * 60 * 24))
      const distanceHour = Math.floor((distance / (1000 * 60 * 60)) % 24)
      const distanceMinute = Math.floor((distance / (1000 * 60)) % 60)
      const distanceSecond = Math.floor((distance / 1000) % 60)
      setMintStartTimeCountdown({
        distance: distance,
        day: distanceDay,
        hour: distanceHour,
        minute: distanceMinute,
        second: distanceSecond,
      })
    }, 1000)
    return () => {
      clearInterval(mintStartTimeCountdownIntervalRef.current)
    }
  }, [mintStartTime, displayMint])

  // mint按钮显示文本
  let mintStartTimeCountdownText = 'MINT'
  if (displayMint) {
    if (loadingMint) {
      mintStartTimeCountdownText = 'Loading...'
    } else if (mintStartTimeCountdown.distance > 0) {
      mintStartTimeCountdownText = 'You can mint in'
      if (mintStartTimeCountdown.day > 0) {
        mintStartTimeCountdownText += ` ${mintStartTimeCountdown.day}d`
      }
      if (mintStartTimeCountdown.hour > 0 || mintStartTimeCountdown.day > 0) {
        mintStartTimeCountdownText += ` ${mintStartTimeCountdown.hour}h`
      }
      if (mintStartTimeCountdown.minute > 0 || mintStartTimeCountdown.hour > 0 || mintStartTimeCountdown.day > 0) {
        mintStartTimeCountdownText += ` ${mintStartTimeCountdown.minute}m`
      }
      if (
        mintStartTimeCountdown.second > 0 ||
        mintStartTimeCountdown.minute > 0 ||
        mintStartTimeCountdown.hour > 0 ||
        mintStartTimeCountdown.day > 0
      ) {
        mintStartTimeCountdownText += ` ${mintStartTimeCountdown.second}s`
      }
    }
  }
  // mint 按钮状态
  const isDisabledMint = disabledMint || mintStartTimeCountdown.distance > 0
  // mint按钮点击事件
  const onMintClick = () => {
    // if (onMint) {
    //   onMint(data)
    // }
    window.open(mintUrl, '_blank', 'noopener,noreferrer')
  }

  // 是否展开action
  const isOpenActionsDefault = allowOpenActions && openActions ? true : false
  const [isOpenActions, setIsOpenActions] = useState(isOpenActionsDefault)
  const onTaskClick = () => {
    if (allowOpenActions) {
      setIsOpenActions(!isOpenActions)
    }
  }
  const onRefreshClick = () => {
    if (onRefreshTask) {
      onRefreshTask(data)
    }
  }
  return (
    <TodoTaskItemWrapper>
      <TaskBasicInfoBox isAllowClick={allowOpenActions} onClick={onTaskClick}>
        <TaskBasicInfoLeftImg src={project.image} />
        <TaskBasicInfoRightBox>
          <TaskName>{name}</TaskName>
          {renderTaskStatusContent()}
        </TaskBasicInfoRightBox>
      </TaskBasicInfoBox>
      {displayMint && (
        <MintBtn disabled={isDisabledMint} onClick={onMintClick}>
          {mintStartTimeCountdownText}
        </MintBtn>
      )}
      {isOpenActions && (
        <TaskActionsBox>
          <TaskActionList items={actions} onDiscord={onDiscord} onTwitter={onTwitter}></TaskActionList>
          <RefreshBtn onClick={onRefreshClick}>Refresh</RefreshBtn>
        </TaskActionsBox>
      )}
    </TodoTaskItemWrapper>
  )
}
export default TodoTaskItem
const TodoTaskItemWrapper = styled.div`
  width: 100%;
  border: 1px solid rgba(16, 16, 16, 100);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 100);
  padding: 10px 15px;
  box-sizing: border-box;
`
const TaskBasicInfoBox = styled.div<{ isAllowClick?: Boolean }>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  ${(props) => props.isAllowClick && `cursor: pointer;`}
`
const TaskBasicInfoLeftImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
`
const TaskBasicInfoRightBox = styled.div`
  flex: 1;
`
const TaskName = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
`
const TaskProgressBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 3px;
  color: rgba(16, 16, 16, 100);
  font-size: 12px;
`
const ExcessTime = styled.div``
const CompleteNum = styled.div``
const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(16, 16, 16, 100);
  font-size: 12px;
`
const StatusIcon = styled.div``
const StatusText = styled.div``

const MintBtn = styled(ButtonBase)`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  background-color: rgba(16, 16, 16, 100);
  color: rgba(255, 255, 255, 100);
  font-size: 14px;
  margin-top: 10px;
`
const RefreshBtn = styled(ButtonBase)`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  background-color: rgba(16, 16, 16, 100);
  color: rgba(255, 255, 255, 100);
  font-size: 14px;
  margin-top: 10px;
`

const TaskActionsBox = styled.div`
  border-top: 1px dashed rgba(16, 16, 16, 100);
  padding-top: 12px;
  margin-top: 10px;
`
