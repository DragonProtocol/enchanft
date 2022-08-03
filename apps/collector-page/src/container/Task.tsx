/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-21 15:52:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-03 11:13:47
 * @Description: file description
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { AsyncRequestStatus } from '../types'
import MainContentBox from '../components/layout/MainContentBox'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchTaskDetail, selectTaskDetail, TaskDetailEntity } from '../features/task/taskDetailSlice'
import TaskActionList, { TaskActionItemsType } from '../components/business/task/TaskActionList'
import {
  TaskAcceptedStatus,
  TaskTodoCompleteStatus,
  TaskType,
  TodoTaskActionItem,
  UserActionStatus,
} from '../types/api'
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
  let winnerNum = task.winnerNum
  // let winnerNum = 0
  // switch (task.type) {
  //   case TaskType.WHITELIST_LUCK_DRAW:
  //     // 需要抽奖
  //     winnerNum = task.winnerList.length || task.whitelistTotalNum
  //   case TaskType.WHITELIST_ORIENTED:
  //     // 直接获得奖励
  //     winnerNum = task.winnerList.length
  // }

  return {
    data: { ...task, winnerNum },
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
const formatStoreDataToComponentDataByTaskActions = (task: TaskDetailEntity): TaskActionItemsType => {
  return [...task.actions].sort((a, b) => a.orderNum - b.orderNum).map((v) => ({ ...v, project: task.project }))
}
const Task: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { token, accounts } = useAppSelector(selectAccount)
  const accountTypes = accounts.map((account) => account.accountType)

  const { taskId: id } = useParams()
  const { status, data } = useAppSelector(selectTaskDetail)
  const dispatchFetchTaskDetail = useCallback(() => dispatch(fetchTaskDetail(Number(id))), [id])
  const [loadingView, setLoadingView] = useState(true)
  const { isCreator, checkTaskAllowed } = usePermissions()
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

  if (loadingView)
    return (
      <TaskDetailLoading>
        <Loading />{' '}
      </TaskDetailLoading>
    )
  if (!data) return null
  const name = data.name || ''
  const { projectId, image } = data
  const { name: projectName, chainId, communityId } = data.project

  const taskDetailContent = data
    ? formatStoreDataToComponentDataByTaskDetailContent(data, token, takeTaskState, accountTypes)
    : null
  const actionItems = formatStoreDataToComponentDataByTaskActions(data)
  const winnerList = data?.winnerList || []
  // 是否允许操作action
  const allowHandleAction =
    data?.acceptedStatus === TaskAcceptedStatus.DONE && data?.status !== TaskTodoCompleteStatus.CLOSED

  // verify action
  const displayVerify = allowHandleAction && actionItems.some((v) => v.status === UserActionStatus.TODO)
  const loadingVerify = status === AsyncRequestStatus.PENDING
  const disabledVerify = loadingVerify

  return (
    <TaskDetailWrapper>
      <MainContentBox>
        {loadingView ? (
          <TaskDetailLoading>
            <Loading />{' '}
          </TaskDetailLoading>
        ) : (
          data && (
            <TaskDetailBodyBox>
              <DetailBodyLeft>
                <ButtonNavigation onClick={handleLeave}>
                  <IconCaretLeft />
                </ButtonNavigation>
              </DetailBodyLeft>
              <DetailBodyRight>
                {taskDetailContent && (
                  <>
                    <TaskDetailTop>
                      <TaskName>{name}</TaskName>
                      <ProjectNameBox>
                        <ProjectName onClick={() => navigate(`/${data.project.slug}`)}>
                          Project: {projectName}
                        </ProjectName>
                        {isCreator && <Button onClick={() => navigate(`/creator/${id}`)}>manage</Button>}
                      </ProjectNameBox>
                      <TaskImageBox>
                        {/* <ChainTag size={2} chainId={chainId} /> */}
                        <TaskImage src={image} />
                      </TaskImageBox>
                    </TaskDetailTop>
                    <TaskDetailContentBox>
                      <TaskDetailContentBoxLeft>
                        <TaskDetailContent
                          data={taskDetailContent.data}
                          viewConfig={taskDetailContent.viewConfig}
                          onConnectWallet={handleOpenConnectWallet}
                          onBindWallet={handleOpenWalletBind}
                          onTake={(task) => handleTakeTask(task.id)}
                        />
                      </TaskDetailContentBoxLeft>
                      <TaskDetailContentBoxRight>
                        {winnerList.length > 0 ? (
                          <TaskListBox>
                            <TaskWinnerList items={winnerList} />
                          </TaskListBox>
                        ) : (
                          <TaskListBox>
                            <TaskActionList
                              items={actionItems}
                              onDiscord={handleActionToDiscord}
                              onTwitter={handleActionToTwitter}
                              allowHandle={allowHandleAction}
                              displayVerify={displayVerify}
                              loadingVerify={loadingVerify}
                              disabledVerify={disabledVerify}
                              onVerifyActions={dispatchFetchTaskDetail}
                              copyBgc="#FFFFFF"
                              verifyBgc="#FFFFFF"
                            />
                          </TaskListBox>
                        )}
                      </TaskDetailContentBoxRight>
                    </TaskDetailContentBox>
                  </>
                )}
              </DetailBodyRight>
            </TaskDetailBodyBox>
          )
        )}
      </MainContentBox>
    </TaskDetailWrapper>
  )
}
export default Task
const TaskDetailWrapper = styled.div`
  width: 100%;
`
const TaskDetailLoading = styled.div`
  text-align: center;
  margin-top: 100px;
`
const TaskDetailBodyBox = styled(CardBox)`
  display: flex;
  gap: 20px;
`
const DetailBodyLeft = styled.div``
const DetailBodyRight = styled.div`
  flex: 1;
  height: 100%;
  padding-right: 50px;
  box-sizing: border-box;
`
const TaskDetailTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`
const TaskImageBox = styled.div`
  position: relative;
`
const TaskName = styled.div`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
`
const TaskImage = styled.img`
  width: 100%;
  height: 460px;
  object-fit: cover;
`
const ProjectNameBox = styled.div`
  display: flex;
  justify-content: space-between;
`
const ProjectName = styled.div`
  font-size: 20px;
  line-height: 30px;
  color: #3dd606;
  cursor: pointer;
`
const TaskDetailContentBox = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  gap: 40px;
`
const TaskDetailContentBoxLeft = styled.div`
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
`
const TaskDetailContentBoxRight = styled.div`
  flex: 1;
  overflow: hidden;
`
const TaskListBox = styled.div`
  width: 100%;
  background: #f8f8f8;
  padding: 20px;
  box-sizing: border-box;
`
