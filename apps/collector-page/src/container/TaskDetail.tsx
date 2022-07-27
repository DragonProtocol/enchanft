/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 15:52:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-27 14:39:58
 * @Description: file description
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { AsyncRequestStatus } from '../types'
import ScrollBox from '../components/common/ScrollBox'
import MainContentBox from '../components/layout/MainContentBox'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchTaskDetail, selectTaskDetail, TaskDetailEntity } from '../features/task/taskDetailSlice'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import IconButton from '@mui/material/IconButton'
import TaskActionList, { TaskActionItemsType } from '../components/business/task/TaskActionList'
import { TaskAcceptedStatus, TaskTodoCompleteStatus, TaskType, TodoTaskActionItem } from '../types/api'
import TaskDetailContent, { TaskDetailContentDataViewType } from '../components/business/task/TaskDetailContent'
import { selectUserTaskHandlesState, take, TakeTaskParams, TaskHandle } from '../features/user/taskHandlesSlice'
import { ConnectModal, selectAccount, setConnectModal, setConnectWalletModalShow } from '../features/user/accountSlice'
import useHandleAction from '../hooks/useHandleAction'
import { ChainType, getChainType } from '../utils/chain'
import { TokenType } from '../utils/token'
import TaskWinnerList from '../components/business/task/TaskWinnerList'
const formatStoreDataToComponentDataByTaskDetailContent = (
  task: TaskDetailEntity,
  token: string,
  takeTaskState: TaskHandle<TakeTaskParams>,
  accountTypes: string[],
): TaskDetailContentDataViewType => {
  const displayConnectWallet = !token
  // 是否需要绑定钱包
  let displayWalletBind = false
  const taskChainType = getChainType(task.project.chainId)
  const walletBindText = taskChainType === ChainType.SOLANA ? 'Bind Phantom Wallet' : 'Bind MeatMask Wallet'
  if (!displayConnectWallet) {
    // 验证当前task对应的链类型是否存在于已绑定的钱包中，不存在则要求账号绑定对应的钱包
    // TODO 这里的几个type类型考虑是否需要统一下
    switch (taskChainType) {
      case ChainType.EVM:
        if (!accountTypes.includes('EVM')) {
          displayWalletBind = true
        }
        break
      case ChainType.SOLANA:
        if (!accountTypes.includes('SOLANA')) {
          displayWalletBind = true
        }
        break
    }
  }

  // const displayAccept = token && task.acceptedStatus === TaskAcceptedStatus.DONE ? true : false
  const displayTake = !displayConnectWallet && !displayWalletBind && task.acceptedStatus === TaskAcceptedStatus.CANDO
  const loadingTake = takeTaskState.params?.id === task.id && takeTaskState.status === AsyncRequestStatus.PENDING
  const disabledTake = loadingTake
  const displayCompleteStatus =
    !displayConnectWallet &&
    !displayWalletBind &&
    !displayTake &&
    task.acceptedStatus === TaskAcceptedStatus.DONE &&
    task.status !== TaskTodoCompleteStatus.CLOSED

  // TODO 待确认
  // 这里先用task的whiteListTotalNum代替
  let winnersNum = 0
  switch (task.type) {
    case TaskType.WHITELIST_LUCK_DRAW:
      // 需要抽奖
      winnersNum = task.winnerList.length || task.whitelistTotalNum
    case TaskType.WHITELIST_ORIENTED:
      // 直接获得奖励
      winnersNum = task.winnerList.length
  }

  return {
    data: { ...task, winnersNum },
    viewConfig: {
      displayConnectWallet,
      displayWalletBind,
      walletBindText,
      // displayAccept,
      displayTake,
      disabledTake,
      loadingTake,
      displayCompleteStatus,
    },
  }
}
const formatStoreDataToComponentDataByTaskActions = (actions: TodoTaskActionItem[]): TaskActionItemsType => {
  return [...actions].sort((a, b) => a.orderNum - b.orderNum)
}
const TaskDetail: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { token, accounts } = useAppSelector(selectAccount)
  const accountTypes = accounts.map((account) => account.accountType)

  const { id } = useParams()
  const { status, data } = useAppSelector(selectTaskDetail)
  const dispatchFetchTaskDetail = useCallback(() => dispatch(fetchTaskDetail(Number(id))), [id])
  const [loadingView, setLoadingView] = useState(true)
  useEffect(() => {
    if (status === AsyncRequestStatus.FULFILLED) {
      setLoadingView(false)
    }
  }, [status])

  useEffect(() => {
    setLoadingView(true)
    dispatchFetchTaskDetail()
  }, [id, token])
  const handleLeave = useCallback(() => {
    navigate(-1)
  }, [])
  // 接受任务
  const handleTakeTask = (id) => {
    dispatch(take({ id }))
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
  // 是否允许操作action
  const allowHandleAction =
    data?.acceptedStatus === TaskAcceptedStatus.DONE && data?.status !== TaskTodoCompleteStatus.CLOSED

  // verify action
  const displayVerify = allowHandleAction
  const loadingVerify = status === AsyncRequestStatus.PENDING
  const disabledVerify = loadingVerify

  if (!loadingView && !data) return null
  const taskDetailContent = data
    ? formatStoreDataToComponentDataByTaskDetailContent(data, token, takeTaskState, accountTypes)
    : null
  const actionItems = formatStoreDataToComponentDataByTaskActions(data?.actions || [])
  const winnerList = data?.winnerList || []
  return (
    <TaskDetailWrapper>
      <ScrollBox>
        <MainContentBox>
          <TaskDetailBodyBox>
            {loadingView ? (
              <TaskDetailLoading>Loading ... </TaskDetailLoading>
            ) : (
              <>
                <DetailHeader>
                  <IconButton onClick={handleLeave}>
                    <ArrowBackIosIcon />
                  </IconButton>
                  <TaskName>{data?.name}</TaskName>
                </DetailHeader>
                {taskDetailContent && (
                  <TaskDetailContentBox>
                    <TaskDetailContent
                      data={taskDetailContent.data}
                      viewConfig={taskDetailContent.viewConfig}
                      onConnectWallet={handleOpenConnectWallet}
                      onBindWallet={handleOpenWalletBind}
                      onTake={(task) => handleTakeTask(task.id)}
                      navToCreator={(task) => {
                        navigate(`/creator/${task.id}`)
                      }}
                    />
                  </TaskDetailContentBox>
                )}
                <TaskActionsBox>
                  <TaskActionList
                    items={actionItems}
                    onDiscord={handleActionToDiscord}
                    onTwitter={handleActionToTwitter}
                    allowHandle={allowHandleAction}
                    displayVerify={displayVerify}
                    loadingVerify={loadingVerify}
                    disabledVerify={disabledVerify}
                    onVerifyActions={dispatchFetchTaskDetail}
                  />
                </TaskActionsBox>
                {winnerList.length > 0 && (
                  <TaskWinnerListBox>
                    <TaskWinnerList items={winnerList} />
                  </TaskWinnerListBox>
                )}
              </>
            )}
          </TaskDetailBodyBox>
        </MainContentBox>
      </ScrollBox>
    </TaskDetailWrapper>
  )
}
export default TaskDetail
const TaskDetailWrapper = styled.div`
  width: 100%;
  height: 100%;
`
const TaskDetailBodyBox = styled.div`
  max-width: 800px;
  margin: 0 auto;
`
const DetailHeader = styled.div`
  width: 100%;
  display: flex;
  gap: 40px;
  align-items: center;
`
const TaskName = styled.div`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
`
const TaskDetailLoading = styled.div`
  width: 100%;
  text-align: center;
`
const TaskDetailContentBox = styled.div`
  margin-top: 40px;
`
const TaskActionsBox = styled.div`
  margin-top: 40px;
`
const TaskWinnerListBox = styled.div`
  margin-top: 40px;
`
