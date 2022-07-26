/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 15:52:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-26 16:06:35
 * @Description: file description
 */
import React, { useCallback, useEffect, useState } from 'react'
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
import { TaskAcceptedStatus, TaskTodoCompleteStatus, TodoTaskActionItem } from '../types/api'
import TaskDetailContent, { TaskDetailContentDataViewType } from '../components/business/task/TaskDetailContent'
import { selectUserTaskHandlesState, take, TakeTaskParams, TaskHandle } from '../features/user/taskHandlesSlice'
import { ConnectModal, selectAccount, setConnectModal } from '../features/user/accountSlice'
import useHandleAction from '../hooks/useHandleAction'
import { ChainType, getChainType } from '../utils/chain'
import { TokenType } from '../utils/token'
const formatStoreDataToComponentDataByTaskDetailContent = (
  task: TaskDetailEntity,
  token: string,
  takeTaskState: TaskHandle<TakeTaskParams>,
  accountTypes: string[],
): TaskDetailContentDataViewType => {
  // 是否需要链接钱包
  let displayConnectWallet = false
  const taskChainType = getChainType(task.project.chainId)
  const connectWalletText = taskChainType === ChainType.SOLANA ? 'Connect Phantom' : 'Connect MeatMask'
  if (!token) {
    displayConnectWallet = true
  } else {
    // 验证当前task对应的链类型 是否和当前登录的链类型一致，不一致的话提示连接正确的钱包
    // TODO 这里的几个type类型考虑是否需要统一下
    switch (taskChainType) {
      case ChainType.EVM:
        if (!accountTypes.includes('EVM')) {
          displayConnectWallet = true
        }
        break
      case ChainType.SOLANA:
        if (!accountTypes.includes('SOLANA')) {
          displayConnectWallet = true
        }
        break
    }
  }

  // const displayAccept = token && task.acceptedStatus === TaskAcceptedStatus.DONE ? true : false
  const displayTake = Boolean(!displayConnectWallet && task.acceptedStatus === TaskAcceptedStatus.CANDO)
  const loadingTake = takeTaskState.params?.id === task.id && takeTaskState.status === AsyncRequestStatus.PENDING
  const disabledTake = loadingTake
  const displayCompleteStatus = Boolean(
    !displayConnectWallet &&
      task.acceptedStatus === TaskAcceptedStatus.DONE &&
      task.status !== TaskTodoCompleteStatus.CLOSED,
  )

  // TODO 待确认，这里先用task的whiteListTotalNum代替
  const winnersNum = task.whitelistTotalNum
  return {
    data: { ...task, winnersNum },
    viewConfig: {
      displayConnectWallet,
      connectWalletText,
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
  useEffect(() => {
    dispatch(fetchTaskDetail(Number(id)))
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
  // 展示数据
  const loading = status === AsyncRequestStatus.PENDING ? true : false
  // 处理执行action操作
  const { handleActionToDiscord, handleActionToTwitter } = useHandleAction()
  // 获取链的类型
  const chainType = data?.project?.chainId ? getChainType(data?.project?.chainId) : ChainType.UNKNOWN
  // 打开连接钱包的窗口
  const modalType = chainType === ChainType.SOLANA ? ConnectModal.PHANTOM : ConnectModal.METAMASK
  const handleOpenConnectWallet = useCallback(() => {
    dispatch(setConnectModal(modalType))
  }, [modalType])
  // 是否允许操作action
  const allowHandleAction = Boolean(
    data?.acceptedStatus === TaskAcceptedStatus.DONE && data?.status !== TaskTodoCompleteStatus.CLOSED,
  )

  // TODO display winner list
  const displayWinnerList = false

  if (!loading && !data) return null
  const taskDetailContent = data
    ? formatStoreDataToComponentDataByTaskDetailContent(data, token, takeTaskState, accountTypes)
    : null
  const actionItems = formatStoreDataToComponentDataByTaskActions(data?.actions || [])

  return (
    <TaskDetailWrapper>
      <ScrollBox>
        <MainContentBox>
          <TaskDetailBodyBox>
            {loading ? (
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
                      onTake={(task) => handleTakeTask(task.id)}
                    />
                  </TaskDetailContentBox>
                )}
                <TaskActionsBox>
                  <TaskActionList
                    items={actionItems}
                    onDiscord={handleActionToDiscord}
                    onTwitter={handleActionToTwitter}
                    allowHandle={allowHandleAction}
                  />
                </TaskActionsBox>
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
