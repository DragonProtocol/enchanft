/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 15:52:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-15 13:53:25
 * @Description: file description
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { AsyncRequestStatus } from '../types'
import MainContentBox from '../components/layout/MainContentBox'
import { useNavigate, useParams } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { fetchTaskDetail, selectTaskDetail, TaskDetailEntity } from '../features/task/taskDetailSlice'
import TaskActionList, { TaskActionItemsType } from '../components/business/task/TaskActionList'
import { ActionType, TaskAcceptedStatus, TaskTodoCompleteStatus, TaskType } from '../types/entities'
import { TodoTaskActionItem, UserActionStatus } from '../types/api'
import TaskDetailContent, { TaskDetailContentDataViewType } from '../components/business/task/TaskDetailContent'
import { selectUserTaskHandlesState, take, TakeTaskParams, TaskHandle } from '../features/user/taskHandlesSlice'
import { ConnectModal, selectAccount, setConnectModal, setConnectWalletModalShow } from '../features/user/accountSlice'
import useHandleAction from '../hooks/useHandleAction'
import { ChainType, getChainType } from '../utils/chain'
import TaskWinnerList from '../components/business/task/TaskWinnerList'
import ButtonNavigation from '../components/common/button/ButtonNavigation'
import IconCaretLeft from '../components/common/icons/IconCaretLeft'
import Button from '@mui/material/Button'
import CardBox from '../components/common/card/CardBox'
import usePermissions from '../hooks/usePermissons'
import Loading from '../components/common/loading/Loading'
import TaskStatusButton, {
  TaskStatusButtonDataViewType,
  TaskStatusButtonType,
} from '../components/business/task/TaskStatusButton'
import TaskImageDefault from '../components/business/task/TaskImageDefault'
import {
  follow as followCommunity,
  selectfollow as selectfollowCommunity,
} from '../features/user/communityHandlesSlice'
import { selectIds as selectIdsByUserFollowedProject } from '../features/user/followedCommunitiesSlice'
import ButtonBase from '../components/common/button/ButtonBase'
import MainInnerStatusBox from '../components/layout/MainInnerStatusBox'
import { toast } from 'react-toastify'
import IconShare from '../components/common/icons/IconShare'
import { TASK_SHARE_URI } from '../constants'
const formatStoreDataToComponentDataByTaskStatusButton = (
  task: TaskDetailEntity,
  token: string,
  takeTaskState: TaskHandle<TakeTaskParams>,
  accountTypes: string[],
): TaskStatusButtonDataViewType | null => {
  // 1. 没链接钱包
  if (!token) {
    return {
      type: TaskStatusButtonType.CONNECT_WALLET,
    }
  }

  // 2.钱包账户没有跟用户系统绑定
  let isBindWallet = false
  const taskChainType = getChainType(task.project.chainId)

  switch (taskChainType) {
    case ChainType.EVM:
      if (accountTypes.includes('EVM')) {
        isBindWallet = true
      }
      break
    case ChainType.SOLANA:
      if (accountTypes.includes('SOLANA')) {
        isBindWallet = true
      }
      break
  }
  if (!isBindWallet) {
    const btnText = taskChainType === ChainType.SOLANA ? 'Bind Phantom Wallet' : 'Bind MeatMask Wallet'
    return {
      type: TaskStatusButtonType.BIND_WALLET,
      btnText,
    }
  }

  // 3. 当前账户可以接受任务，但还没接
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

  // 4. 当前任务是否正在进行中
  // TODO 考虑直接将TaskTodoCompleteStatus枚举值合并到TaskStatusButtonType枚举值中
  const isDone = task.acceptedStatus === TaskAcceptedStatus.DONE
  if (isDone) {
    switch (task.status) {
      case TaskTodoCompleteStatus.TODO:
        return {
          type: TaskStatusButtonType.TODO,
        }
      case TaskTodoCompleteStatus.COMPLETED:
        return {
          type: TaskStatusButtonType.COMPLETE,
        }
    }
  }

  return null
}
const formatStoreDataToComponentDataByTaskActions = (
  task: TaskDetailEntity,
  userFollowedProjectIds: number[],
): TaskActionItemsType => {
  return [...task.actions]
    .sort((a, b) => a.orderNum - b.orderNum)
    .map((v) => {
      const action = { ...v, project: task.project }
      // TODO 如果检索到当前action是关注社区的action，且在我关注的社区中，并且我已经接了，则将其状态改为已完成
      if (
        task.acceptedStatus === TaskAcceptedStatus.DONE &&
        action.type === ActionType.TURN_ON_NOTIFICATION &&
        userFollowedProjectIds.includes(action.communityId)
      ) {
        Object.assign(action, {
          status: UserActionStatus.DONE,
        })
      }
      return action
    })
}
const Task: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { token, accounts } = useAppSelector(selectAccount)
  const accountTypes = accounts.map((account) => account.accountType)

  const { taskId: id, projectSlug } = useParams()
  const { status, data } = useAppSelector(selectTaskDetail)
  const dispatchFetchTaskDetail = useCallback(() => id && dispatch(fetchTaskDetail(Number(id))), [id])
  const [loadingView, setLoadingView] = useState(false)
  const { isCreator, checkTaskAllowed } = usePermissions()

  // slug 变化，重新请求数据，并进入loading状态
  useEffect(() => {
    setLoadingView(true)
    dispatchFetchTaskDetail()
  }, [id])
  // token 变化，重新请求详情数据
  useEffect(() => {
    dispatchFetchTaskDetail()
  }, [token])
  // 确保终止loading状态
  useEffect(() => {
    if (loadingView && ![AsyncRequestStatus.IDLE, AsyncRequestStatus.PENDING].includes(status)) {
      setLoadingView(false)
    }
  }, [loadingView, status])

  const handleLeave = useCallback(() => {
    navigate(-1)
  }, [])
  const handleTakeTask = () => {
    dispatch(take({ id: Number(id) }))
  }
  // 接任务的状态
  const { take: takeTaskState } = useAppSelector(selectUserTaskHandlesState)
  // 处理执行action操作
  const { handleActionToDiscord, handleActionToTwitter } = useHandleAction()
  // 获取链的类型
  const chainType = data?.project?.chainId ? getChainType(data?.project?.chainId) : ChainType.UNKNOWN
  // 打开连接钱包的窗口
  const handleOpenConnectWallet = useCallback(() => {
    dispatch(setConnectWalletModalShow(true))
  }, [])
  // 打开绑定钱包账户的窗口
  const modalType = chainType === ChainType.SOLANA ? ConnectModal.PHANTOM : ConnectModal.METAMASK
  const handleOpenWalletBind = useCallback(() => {
    dispatch(setConnectModal(modalType))
  }, [modalType])

  // 关注社区
  const handleFollowCommunity = (communityId: number) => {
    dispatch(followCommunity({ id: communityId }))
  }
  // 用户关注的社区ID集合
  const userFollowedProjectIds = useAppSelector(selectIdsByUserFollowedProject)

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
  // 接受任务
  const name = data.name || ''
  const { projectId, image } = data
  const { name: projectName, chainId, communityId } = data.project
  // task status button
  const taskStatusButton = formatStoreDataToComponentDataByTaskStatusButton(data, token, takeTaskState, accountTypes)
  // task action and winnerList
  const actionItems = formatStoreDataToComponentDataByTaskActions(
    data,
    userFollowedProjectIds.map((item) => Number(item)),
  )
  const winnerList = data?.winnerList || []
  // 是否允许操作action
  const allowHandleAction =
    data?.acceptedStatus === TaskAcceptedStatus.DONE && data?.status !== TaskTodoCompleteStatus.CLOSED

  // verify action
  const displayVerify = allowHandleAction && actionItems.some((v) => v.status === UserActionStatus.TODO)
  const loadingVerify = status === AsyncRequestStatus.PENDING
  const disabledVerify = loadingVerify
  const verifyingActions = loadingVerify
    ? actionItems.filter((item) => item.status === UserActionStatus.TODO).map((item) => item.id)
    : []
  // 后面如果带/，则去掉/
  const taskShareUrl = TASK_SHARE_URI?.replace(/\/$/, '') + `/${projectSlug}/${id}`
  return (
    <TaskDetailWrapper>
      <MainContentBox>
        <TaskDetailBodyBox>
          <TaskDetailHeaderBox>
            <ButtonNavigation onClick={handleLeave}>
              <IconCaretLeft />
            </ButtonNavigation>
            <TaskName>{name}</TaskName>
            <CopyToClipboard text={taskShareUrl} onCopy={() => toast.success('Link copied.')}>
              <ShareButton>
                <IconShare size="16px" />
              </ShareButton>
            </CopyToClipboard>

            {isCreator && <ManageButton onClick={() => navigate(`/creator/${id}`)}>Task Management</ManageButton>}
          </TaskDetailHeaderBox>
          <ProjectNameBox>
            <ProjectName onClick={() => navigate(`/${data.project.slug}`)}>Project: {projectName}</ProjectName>
          </ProjectNameBox>
          <TaskDetailContentBox>
            <TaskDetailContentBoxLeft>
              <TaskImage src={image} />
              <TaskDetailContent data={data} />
            </TaskDetailContentBoxLeft>
            <TaskDetailContentBoxRight>
              {winnerList.length > 0 ? (
                <TaskListBox>
                  <TaskWinnerList items={winnerList} />
                </TaskListBox>
              ) : (
                <>
                  <TaskListBox>
                    {taskStatusButton && (
                      <TaskStatusButton
                        type={taskStatusButton.type}
                        loading={taskStatusButton.loading}
                        disabled={taskStatusButton.disabled}
                        btnText={taskStatusButton.btnText}
                        onConnectWallet={handleOpenConnectWallet}
                        onBindWallet={handleOpenWalletBind}
                        onTake={handleTakeTask}
                      />
                    )}
                    <TaskActionList
                      items={actionItems}
                      onDiscord={handleActionToDiscord}
                      onTwitter={handleActionToTwitter}
                      onFollowCommunity={(action) => handleFollowCommunity(action.communityId)}
                      allowHandle={allowHandleAction}
                      displayVerify={displayVerify}
                      loadingVerify={loadingVerify}
                      disabledVerify={disabledVerify}
                      verifyingActions={verifyingActions}
                      onVerifyActions={dispatchFetchTaskDetail}
                      copyBgc="#FFFFFF"
                      verifyBgc="#FFFFFF"
                    />
                  </TaskListBox>
                </>
              )}
            </TaskDetailContentBoxRight>
          </TaskDetailContentBox>
        </TaskDetailBodyBox>
      </MainContentBox>
    </TaskDetailWrapper>
  )
}
export default Task
const TaskDetailWrapper = styled.div`
  width: 100%;
`
const TaskDetailBodyBox = styled(CardBox)`
  padding: 40px;
  display: flex;
  flex-direction: column;
`
const TaskDetailHeaderBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`
const TaskName = styled.div`
  flex: 1;
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  color: #333333;
`
const ProjectNameBox = styled.div`
  padding-top: 5px;
  padding-left: 70px;
`
const ProjectName = styled.span`
  font-size: 20px;
  line-height: 30px;
  color: #3dd606;
  cursor: pointer;
`
const ShareButton = styled(ButtonBase)`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f8f8;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
`
const ManageButton = styled(ButtonBase)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 18px;
  width: 210px;
  height: 48px;

  background: #f8f8f8;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);

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
`

const TaskDetailContentBox = styled.div`
  width: 100%;
  margin-top: 18px;
  display: flex;
  gap: 40px;
`
const TaskDetailContentBoxLeft = styled.div`
  flex: 1;
  box-sizing: border-box;
  overflow: hidden;
`
const TaskDetailContentBoxRight = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const TaskListBox = styled.div`
  width: 100%;
  background: #f8f8f8;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
