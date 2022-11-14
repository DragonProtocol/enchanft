/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 15:52:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-14 15:01:21
 * @Description: file description
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { AsyncRequestStatus } from '../types'
import { useNavigate, useParams } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  fetchTaskDetail,
  selectTaskDetail,
  resetTaskDetailState,
  TaskDetailEntity,
} from '../features/task/taskDetailSlice'
import TaskActionList, { TaskActionItemsType } from '../components/business/task/TaskActionList'
import { ActionType, TaskAcceptedStatus, TaskTodoCompleteStatus, TaskType } from '../types/entities'
import { TodoTaskActionItem, UserActionStatus } from '../types/api'
import TaskDetailContent, { TaskDetailContentDataViewType } from '../components/business/task/TaskDetailContent'
import {
  selectIdsVerifyActionQueue,
  selectIdsVerifyTaskQueue,
  selectUserTaskHandlesState,
  takeTask,
  TakeTaskParams,
  TaskHandle,
  verifyTask,
  verifyAction,
  completionAction,
} from '../features/user/taskHandlesSlice'
import useHandleAction from '../hooks/useHandleAction'
import { ChainType, getChainType } from '../utils/chain'
import TaskWinnerList from '../components/business/task/TaskWinnerList'
import ButtonNavigation from '../components/common/button/ButtonNavigation'
import IconCaretLeft from '../components/common/icons/IconCaretLeft'
import PngIconForbidden from '../components/common/icons/PngIconForbidden'
import PngIconHourglass from '../components/common/icons/PngIconHourglass'
import Button from '@mui/material/Button'
import CardBox from '../components/common/card/CardBox'
import Loading from '../components/common/loading/Loading'
import TaskStatusButton, {
  TaskStatusButtonDataViewType,
  TaskStatusButtonType,
} from '../components/business/task/TaskStatusButton'
import TaskImageDefault from '../components/business/task/TaskImageDefault'
import { follow as followCommunity } from '../features/user/communityHandlesSlice'
import { selectIds as selectIdsByUserFollowedCommunity } from '../features/user/followedCommunitiesSlice'
import ButtonBase, { ButtonInfo } from '../components/common/button/ButtonBase'
import MainInnerStatusBox from '../components/layout/MainInnerStatusBox'
import { toast } from 'react-toastify'
import IconShare from '../components/common/icons/IconShare'
import {
  MOBILE_BREAK_POINT,
  SHARE_EVENT_TWEET_CONTENTS,
  TASK_PARTICIPANTS_DISPLAY_MIN_NUM,
  TASK_SHARE_URI,
} from '../constants'
import { tweetShare } from '../utils/twitter'
import useTimeCountdown from '../hooks/useTimeCountdown'
import TimeCountdown from '../components/common/time/TimeCountdown'
import useAccountOperationForChain, { AccountOperationType } from '../hooks/useAccountOperationForChain'
import TaskDetailParticipants from '../components/business/task/TaskDetailParticipants'
import { isDesktop, isMobile } from 'react-device-detect'
import { toWlModPageTaskDetail } from '../route/utils'
import { usePermissions, useWlUserReact } from '@ecnft/wl-user-react'
const formatStoreDataToComponentDataByTaskStatusButton = (
  task: TaskDetailEntity,
  takeTaskState: TaskHandle<TakeTaskParams>,
  accountOperationType: AccountOperationType,
  accountOperationDesc: string,
): TaskStatusButtonDataViewType | null => {
  // 1. 账户未绑定
  if (accountOperationType !== AccountOperationType.COMPLETED) {
    return {
      type: TaskStatusButtonType.ACCOUNT_OPERATION,
      // btnText: accountOperationDesc,
    }
  }

  // 2. 已经接了任务
  const isDone = task.acceptedStatus === TaskAcceptedStatus.DONE
  if (isDone) {
    switch (task.status) {
      case TaskTodoCompleteStatus.COMPLETED: // 已经完成了任务
        return {
          type: TaskStatusButtonType.COMPLETE,
        }
      case TaskTodoCompleteStatus.CLOSED: // 任务已关闭
        return {
          type: TaskStatusButtonType.MISSION_OFF,
        }
    }
    return null
  }

  // 3. 还没接任务，且当前账户可以接受任务
  const isCanTake = task.acceptedStatus === TaskAcceptedStatus.CANDO
  if (isCanTake) {
    const loadingTake = takeTaskState.status === AsyncRequestStatus.PENDING
    const disabledTake = loadingTake
    return {
      type: TaskStatusButtonType.TAKE,
      loading: loadingTake,
      disabled: disabledTake,
    }
  }

  // 4. 其它
  return null
}
const formatStoreDataToComponentDataByTaskActions = (
  task: TaskDetailEntity,
  userFollowedCommunityIds: number[],
): TaskActionItemsType => {
  return [...(task?.actions || [])]
    .sort((a, b) => a.orderNum - b.orderNum)
    .map((v) => {
      const action = { ...v, project: task.project }
      // TODO 如果检索到当前action是关注社区的action，且在我关注的社区中，并且我已经接了，则将其状态改为已完成
      // if (
      //   task.acceptedStatus === TaskAcceptedStatus.DONE &&
      //   action.type === ActionType.TURN_ON_NOTIFICATION &&
      //   userFollowedCommunityIds.includes(action.communityId)
      // ) {
      //   Object.assign(action, {
      //     status: UserActionStatus.DONE,
      //   })
      // }
      return action
    })
}
const Task: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { user } = useWlUserReact()
  const { token, id: userId } = user
  const { taskId: id, projectSlug } = useParams()
  const { status, data } = useAppSelector(selectTaskDetail)
  const dispatchFetchTaskDetail = useCallback(() => id && dispatch(fetchTaskDetail(Number(id))), [id])
  const [loadingView, setLoadingView] = useState(false)
  const { isCreator, checkTaskAllowed, checkProjectAllowed } = usePermissions()

  // 按钮执行前要对账户进行的操作
  const { accountOperationType, accountOperationDesc, handleAccountOperation } = useAccountOperationForChain(
    data?.project?.chainId,
  )

  // 进入loading状态
  useEffect(() => {
    setLoadingView(true)
  }, [id])
  // id、token 变化，重新请求详情数据
  useEffect(() => {
    dispatchFetchTaskDetail()
    return () => {
      dispatch(resetTaskDetailState())
    }
  }, [id, token])
  // 确保终止loading状态
  useEffect(() => {
    if (loadingView && ![AsyncRequestStatus.IDLE, AsyncRequestStatus.PENDING].includes(status)) {
      setLoadingView(false)
    }
  }, [loadingView, status])

  const handleLeave = useCallback(() => {
    navigate(-1)
  }, [])

  // task start countdown
  const taskStartCountdown = useTimeCountdown(data?.startTime || 0)

  // handles: take, verify
  const { takeTask: takeTaskState } = useAppSelector(selectUserTaskHandlesState)
  const handleTakeTask = () => {
    dispatch(takeTask({ id: Number(id) }))
  }

  // 处理执行action操作
  const {
    handleActionToDiscord,
    handleActionToTwitter,
    handleActionQuestionConfirm,
    handleActionVolidBindWalletForChain,
    handleActionQuestionVerifyConfirm,
  } = useHandleAction()

  // 关注社区
  const handleFollowCommunity = (communityId: number) => {
    dispatch(followCommunity({ id: communityId }))
  }
  // 用户关注的社区ID集合
  const userFollowedCommunityIds = useAppSelector(selectIdsByUserFollowedCommunity).map((item) => Number(item))

  // verify task queue
  const verifingTaskIds = useAppSelector(selectIdsVerifyTaskQueue).map((item) => Number(item))
  // verify action queue
  const verifingActionIds = useAppSelector(selectIdsVerifyActionQueue).map((item) => Number(item))

  if (loadingView)
    return (
      <MainInnerStatusBox>
        <Loading />{' '}
      </MainInnerStatusBox>
    )

  if (!data) {
    return (
      <MainInnerStatusBox>
        Can't find task {projectSlug}/{id}
      </MainInnerStatusBox>
    )
  }

  const name = data.name || ''
  const { image, participants, project } = data
  // task status button
  const taskStatusButtonData = formatStoreDataToComponentDataByTaskStatusButton(
    data,
    takeTaskState,
    accountOperationType,
    accountOperationDesc,
  )
  // task action and winnerList
  const actionItems = formatStoreDataToComponentDataByTaskActions(data, userFollowedCommunityIds)
  const winnerList = [...(data?.winnerList || [])]
  if (userId) {
    winnerList.sort((a, b) => {
      if (a.id === userId) {
        return -1
      }
      if (b.id === userId) {
        return 1
      }
      return 0
    })
  }
  // 是否允许操作action
  const allowHandleAction =
    data?.acceptedStatus === TaskAcceptedStatus.DONE && data?.status !== TaskTodoCompleteStatus.CLOSED

  // verify action
  const displayVerify = allowHandleAction && actionItems.some((v) => v.status === UserActionStatus.TODO)
  const loadingVerify = verifingTaskIds.includes(data.id)
  const disabledVerify = loadingVerify
  let verifyingActions = verifingActionIds
  if (loadingVerify) {
    verifyingActions = actionItems.filter((item) => item.status === UserActionStatus.TODO).map((item) => item.id)
  }

  // 后面如果带/，则去掉/
  const taskShareUrl = TASK_SHARE_URI?.replace(/\/$/, '') + `/${projectSlug}/${id}`
  const displayParticipants =
    participants && participants.takers !== undefined && participants.takers >= TASK_PARTICIPANTS_DISPLAY_MIN_NUM
  return (
    <TaskDetailWrapper>
      <TaskDetailBodyBox>
        {data?.status === TaskTodoCompleteStatus.CLOSED && (
          <TaskDetailBodyMainBanner>
            <PngIconForbidden size="20px" /> Task Closed!
          </TaskDetailBodyMainBanner>
        )}

        <TaskDetailBodyMainBox>
          <TaskDetailHeaderBox>
            {isDesktop && (
              <ButtonNavigation onClick={handleLeave}>
                <IconCaretLeft />
              </ButtonNavigation>
            )}

            <TaskName>{name}</TaskName>
            {/* <CopyToClipboard text={taskShareUrl} onCopy={() => toast.success('Link copied.')}>
                <ShareButton>
                  <IconShare size="16px" />
                </ShareButton>
              </CopyToClipboard> */}

            <ShareButton onClick={() => tweetShare(SHARE_EVENT_TWEET_CONTENTS, taskShareUrl)}>
              <IconShare size="16px" />
            </ShareButton>

            {isDesktop && project && checkProjectAllowed(Number(project.id)) && isCreator && (
              <ManageButton onClick={() => toWlModPageTaskDetail(data.id, project.slug)}>Tasks Management</ManageButton>
            )}
          </TaskDetailHeaderBox>
          <ProjectNameBox>
            <ProjectName onClick={() => project?.slug && navigate(`/${project.slug}`)}>
              Project: {project?.name || 'Unknown Project'}
            </ProjectName>
          </ProjectNameBox>
          <TaskDetailContentBox>
            <TaskDetailContentBoxLeft>
              <TaskImage src={image} />
              <TaskDetailContent data={data} />
            </TaskDetailContentBoxLeft>
            {isDesktop && <TaskDetailContentDividingLine />}
            <TaskDetailContentBoxRight>
              {winnerList.length > 0 ? (
                <TaskListBox>
                  <TaskWinnerList items={winnerList} highlightIds={[userId]} />
                </TaskListBox>
              ) : (
                <>
                  {taskStartCountdown.distance > 0 && (
                    <TaskListBox>
                      <TaskStartCountdownBox>
                        <PngIconHourglass />
                        <TimeCountdown data={taskStartCountdown} />
                      </TaskStartCountdownBox>
                    </TaskListBox>
                  )}
                  <TaskListBox>
                    {taskStartCountdown.distance <= 0 && taskStatusButtonData && (
                      <TaskStatusButton
                        type={taskStatusButtonData.type}
                        loading={taskStatusButtonData.loading}
                        disabled={taskStatusButtonData.disabled}
                        // btnText={taskStatusButtonData.btnText}
                        onAccountOperation={handleAccountOperation}
                        onTake={handleTakeTask}
                      />
                    )}
                    <TaskActionList
                      items={actionItems}
                      onDiscord={handleActionToDiscord}
                      onTwitter={handleActionToTwitter}
                      onWallet={handleActionVolidBindWalletForChain}
                      onFollowCommunity={(action) => handleFollowCommunity(action.communityId)}
                      allowHandle={allowHandleAction}
                      displayVerify={displayVerify}
                      loadingVerify={loadingVerify}
                      disabledVerify={disabledVerify}
                      verifyingActions={verifyingActions}
                      onVerifyActions={() => dispatch(verifyTask(data))}
                      onVerifyAction={(action) => dispatch(verifyAction(action))}
                      onCustomAction={(action) => dispatch(completionAction(action))}
                      onQuestionConfirm={handleActionQuestionConfirm}
                      onQuestionVerifyConfirm={handleActionQuestionVerifyConfirm}
                      copyBgc="#FFFFFF"
                      verifyBgc="#FFFFFF"
                    />
                  </TaskListBox>
                </>
              )}
              {displayParticipants && (
                <>
                  {isMobile && <TaskDetailContentHorizontalDividingLine />}
                  <TaskDetailParticipants
                    items={participants?.userDetails || []}
                    takers={participants?.takers || 0}
                    finishers={participants?.finishers || 0}
                  />
                </>
              )}
            </TaskDetailContentBoxRight>
          </TaskDetailContentBox>
        </TaskDetailBodyMainBox>
      </TaskDetailBodyBox>
    </TaskDetailWrapper>
  )
}
export default Task
const TaskDetailWrapper = styled.div`
  width: 100%;
`
const TaskDetailBodyBox = styled(CardBox)`
  padding: 0;
  overflow: hidden;
`
const TaskDetailBodyMainBanner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 50px;
  background: rgba(235, 183, 0, 0.5);
`
const TaskDetailBodyMainBox = styled.div`
  padding: 40px;
  padding-bottom: 0px;
  box-sizing: border-box;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    padding: 20px;
    padding-bottom: 0px;
  }
`
const TaskDetailHeaderBox = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`
const TaskName = styled.div`
  flex: 1;
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 20px;
    line-height: 30px;
  }
`
const ProjectNameBox = styled.div`
  padding-top: 5px;
  padding-left: 70px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    padding-left: 0px;
  }
`
const ProjectName = styled.span`
  font-size: 20px;
  line-height: 30px;
  color: #3dd606;
  cursor: pointer;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 14px;
    line-height: 21px;
  }
`
const ShareButton = styled(ButtonInfo)`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ManageButton = styled(ButtonInfo)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 18px;
  width: 210px;
  height: 48px;

  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`

const TaskImage = styled(TaskImageDefault)`
  width: 100%;
  height: 253px;
  object-fit: cover;
  margin-bottom: 26px;
  border-radius: 10px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    height: 138px;
    margin-bottom: 20px;
  }
`

const TaskDetailContentBox = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  gap: 40px;
  border-top: solid 2px #333333;
  box-sizing: border-box;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
    gap: 20px;
    border-top: none;
    margin-top: 0;
  }
`
const TaskDetailContentDividingLine = styled.div`
  width: 2px;
  background: #333333;
`
const TaskDetailContentHorizontalDividingLine = styled.div`
  height: 2px;
  background: #333333;
`
const TaskDetailContentBoxLeft = styled.div`
  flex: 1;
  box-sizing: border-box;
  overflow: hidden;
  padding-top: 20px;
  padding-bottom: 40px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    padding-bottom: 0;
  }
`
const TaskDetailContentBoxRight = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-top: 20px;
  padding-bottom: 40px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    padding-top: 0px;
    padding-bottom: 20px;
    gap: 20px;
  }
`
const TaskListBox = styled.div`
  width: 100%;
  background: #ebeee4;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    background: none;
    border-radius: 0px;
    padding: 0px;
  }
`
const TaskStartCountdownBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`
