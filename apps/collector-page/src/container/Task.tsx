/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 15:52:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-23 17:20:45
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
import {
  selectIdsVerifyActionQueue,
  selectIdsVerifyTaskQueue,
  selectUserTaskHandlesState,
  takeTask,
  TakeTaskParams,
  TaskHandle,
  verifyTask,
  verifyAction,
} from '../features/user/taskHandlesSlice'
import { ConnectModal, selectAccount, setConnectModal, setConnectWalletModalShow } from '../features/user/accountSlice'
import useHandleAction from '../hooks/useHandleAction'
import { ChainType, getChainType } from '../utils/chain'
import TaskWinnerList from '../components/business/task/TaskWinnerList'
import ButtonNavigation from '../components/common/button/ButtonNavigation'
import IconCaretLeft from '../components/common/icons/IconCaretLeft'
import PngIconForbidden from '../components/common/icons/PngIconForbidden'
import Button from '@mui/material/Button'
import CardBox from '../components/common/card/CardBox'
import usePermissions from '../hooks/usePermissons'
import Loading from '../components/common/loading/Loading'
import TaskStatusButton, {
  TaskStatusButtonDataViewType,
  TaskStatusButtonType,
} from '../components/business/task/TaskStatusButton'
import TaskImageDefault from '../components/business/task/TaskImageDefault'
import { follow as followCommunity } from '../features/user/communityHandlesSlice'
import { selectIds as selectIdsByUserFollowedProject } from '../features/user/followedCommunitiesSlice'
import ButtonBase, { ButtonInfo } from '../components/common/button/ButtonBase'
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

  // 2. 已经接了任务
  // TODO 考虑直接将TaskTodoCompleteStatus枚举值合并到TaskStatusButtonType枚举值中
  const isDone = task.acceptedStatus === TaskAcceptedStatus.DONE
  if (isDone) {
    // 2.1 已经完成了任务
    if (task.status === TaskTodoCompleteStatus.COMPLETED) {
      return {
        type: TaskStatusButtonType.COMPLETE,
      }
    } else {
      return null
    }
  }

  // 3.还没接任务，且钱包账户没有跟用户系统绑定
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
    const btnText = taskChainType === ChainType.SOLANA ? 'Bind Phantom Wallet' : 'Bind MetaMask Wallet'
    return {
      type: TaskStatusButtonType.BIND_WALLET,
      btnText,
    }
  }
  // 4. 还没接任务，且当前账户可以接受任务
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
      // if (
      //   task.acceptedStatus === TaskAcceptedStatus.DONE &&
      //   action.type === ActionType.TURN_ON_NOTIFICATION &&
      //   userFollowedProjectIds.includes(action.communityId)
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
  const { token, accounts, pubkey } = useAppSelector(selectAccount)
  const accountTypes = accounts.map((account) => account.accountType)

  const { taskId: id, projectSlug } = useParams()
  const { status, data } = useAppSelector(selectTaskDetail)
  const dispatchFetchTaskDetail = useCallback(() => id && dispatch(fetchTaskDetail(Number(id))), [id])
  const [loadingView, setLoadingView] = useState(false)
  const { isCreator, checkTaskAllowed, checkProjectAllowed } = usePermissions()

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

  // handles: take, verify
  const { takeTask: takeTaskState } = useAppSelector(selectUserTaskHandlesState)
  const handleTakeTask = () => {
    dispatch(takeTask({ id: Number(id) }))
  }

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
  const userFollowedProjectIds = useAppSelector(selectIdsByUserFollowedProject).map((item) => Number(item))

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
  const { projectId, image } = data
  const { name: projectName, chainId, communityId } = data.project
  // task status button
  const taskStatusButton = formatStoreDataToComponentDataByTaskStatusButton(data, token, takeTaskState, accountTypes)
  // task action and winnerList
  const actionItems = formatStoreDataToComponentDataByTaskActions(data, userFollowedProjectIds)
  const winnerList = data?.winnerList || []
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

  return (
    <TaskDetailWrapper>
      <MainContentBox>
        <TaskDetailBodyBox>
          {data?.status === TaskTodoCompleteStatus.CLOSED && (
            <TaskDetailBodyMainBanner>
              <PngIconForbidden size="20px" /> Whitelist Closed!
            </TaskDetailBodyMainBanner>
          )}

          <TaskDetailBodyMainBox>
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

              {data.project.id && checkProjectAllowed(Number(data.project.id)) && isCreator && (
                <ManageButton onClick={() => navigate(`/creator/${id}`)}>Tasks Management</ManageButton>
              )}
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
                    <TaskWinnerList items={winnerList} highlightPubkeys={[pubkey]} />
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
                        onVerifyActions={() => dispatch(verifyTask(data))}
                        onVerifyAction={(action) => dispatch(verifyAction(action))}
                        copyBgc="#FFFFFF"
                        verifyBgc="#FFFFFF"
                      />
                    </TaskListBox>
                  </>
                )}
              </TaskDetailContentBoxRight>
            </TaskDetailContentBox>
          </TaskDetailBodyMainBox>
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
  box-sizing: border-box;
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
  background: #ebeee4;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
