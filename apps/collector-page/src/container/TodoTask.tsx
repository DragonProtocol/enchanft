/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:17:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-15 11:42:54
 * @Description: file description
 */
import React, { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import ScrollBox from '../components/common/scroll/ScrollBox'
import { ActionType, RewardType, TaskTodoCompleteStatus } from '../types/entities'
import { UserActionStatus } from '../types/api'
import { AsyncRequestStatus } from '../types'
import TodoTaskList, { TodoTaskListItemsType } from '../components/business/task/TodoTaskList'
import { selectAll, selectUserTodoTasksState, TodoTaskItemForEntity } from '../features/user/todoTasksSlice'
import { useSearchParams } from 'react-router-dom'
import useHandleAction from '../hooks/useHandleAction'
import { follow as followCommunity, selectUserCommunityHandlesState } from '../features/user/communityHandlesSlice'
import { selectIds as selectIdsByUserFollowedCommunity } from '../features/user/followedCommunitiesSlice'
import {
  completionAction,
  selectIdsVerifyActionQueue,
  selectIdsVerifyTaskQueue,
  verifyAction,
  verifyTask,
} from '../features/user/taskHandlesSlice'
import { MOBILE_BREAK_POINT } from '../constants'
import useTodoTasksGroup from '../hooks/useTodoTasksGroup'

// TODO 将以下格式化函数合并为一个
const formatStoreDataToComponentDataByTodoList = (
  tasks: TodoTaskItemForEntity[],
  taskId: number,
  followCommunityStatus: AsyncRequestStatus,
  userFollowedCommunityIds: number[],
  verifingTaskIds: number[],
  verifingActionIds: number[],
): TodoTaskListItemsType => {
  return tasks.map((task) => {
    const actions = [...(task?.actions || [])]
      .sort((a, b) => a.orderNum - b.orderNum)
      .map((v) => {
        const action = { ...v, project: task?.project }
        // TODO 如果检索到当前action是关注社区的action，且在我关注的社区中，则将其状态改为已完成
        // if (action.type === ActionType.TURN_ON_NOTIFICATION && userFollowedCommunityIds.includes(action.communityId)) {
        //   Object.assign(action, {
        //     status: UserActionStatus.DONE,
        //   })
        // }
        return action
      })
    const loadingRefresh = verifingTaskIds.includes(task.id)
    const openActions = task.id === taskId
    let verifyingActions = verifingActionIds
    if (loadingRefresh) {
      verifyingActions = actions.filter((item) => item.status === UserActionStatus.TODO).map((item) => item.id)
    }
    if (followCommunityStatus === AsyncRequestStatus.PENDING) {
      // 如果当前关注社区的请求正在进行中，设定需要loading的action集合
      // TODO 暂时先检索是关注社区的action，(按理说整理应该用find查找communityId)
      const followCommunityActionIds = actions
        .filter((item) => item.type === ActionType.TURN_ON_NOTIFICATION)
        .map((item) => item.id)
      verifyingActions = [...new Set([...verifyingActions, ...followCommunityActionIds])]
    }
    return {
      data: { ...task, actions },
      viewConfig: {
        allowOpenActions: true,
        openActions: openActions,
        allowHandleActions: true,
        displayRefresh: true,
        disabledRefresh: loadingRefresh,
        loadingRefresh: loadingRefresh,
        loadingRefreshMsg: 'verifying...',
        verifyingActions: verifyingActions,
      },
    }
  })
}
const formatStoreDataToComponentDataByInProgressList = (
  tasks: TodoTaskItemForEntity[],
  taskId: number,
  followCommunityStatus: AsyncRequestStatus,
  userFollowedCommunityIds: number[],
  verifingTaskIds: number[],
  verifingActionIds: number[],
): TodoTaskListItemsType => {
  return tasks.map((task) => {
    const actions = [...(task?.actions || [])]
      .sort((a, b) => a.orderNum - b.orderNum)
      .map((v) => {
        const action = { ...v, project: task.project }
        // TODO 如果检索到当前action是关注社区的action，且在我关注的社区中，则将其状态改为已完成
        // if (action.type === ActionType.TURN_ON_NOTIFICATION && userFollowedCommunityIds.includes(action.communityId)) {
        //   Object.assign(action, {
        //     status: UserActionStatus.DONE,
        //   })
        // }
        return action
      })
    const loadingRefresh = verifingTaskIds.includes(task.id)
    const openActions = task.id === taskId
    let verifyingActions = verifingActionIds
    if (loadingRefresh) {
      verifyingActions = actions.filter((item) => item.status === UserActionStatus.TODO).map((item) => item.id)
    }
    if (followCommunityStatus === AsyncRequestStatus.PENDING) {
      // 如果当前关注社区的请求正在进行中，设定需要loading的action集合
      // TODO 暂时先检索是关注社区的action，(按理说整理应该用find查找communityId)
      const followCommunityActionIds = actions
        .filter((item) => item.type === ActionType.TURN_ON_NOTIFICATION)
        .map((item) => item.id)
      verifyingActions = [...new Set([...verifyingActions, ...followCommunityActionIds])]
    }
    return {
      data: { ...task, actions },
      viewConfig: {
        allowOpenActions: true,
        openActions: openActions,
        allowHandleActions: true,
        displayRefresh: true,
        disabledRefresh: loadingRefresh,
        loadingRefresh: loadingRefresh,
        loadingRefreshMsg: 'verifying...',
        verifyingActions: verifyingActions,
      },
    }
  })
}

const formatStoreDataToComponentDataByCompletedList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, actions: [] },
      viewConfig: {
        allowNavigateToTask: true,
      },
    }
  })
}

const formatStoreDataToComponentDataByWonList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, actions: [] },
      viewConfig: {
        displayReward: true,
        allowNavigateToTask: true,
      },
    }
  })
}

const formatStoreDataToComponentDataByLostList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, actions: [] },
      viewConfig: {
        allowNavigateToTask: true,
      },
    }
  })
}

const formatStoreDataToComponentDataByClosedList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, actions: [] },
      viewConfig: {
        allowNavigateToTask: true,
      },
    }
  })
}

const TodoTask: React.FC = () => {
  const dispatch = useAppDispatch()
  const { todoItems, inProgressItems, completedItems, wonItems, lostItems, closedItems } = useTodoTasksGroup()

  const [searchParams, setSearchParams] = useSearchParams()
  const hasTaskId = searchParams.has('taskId')
  const taskId = hasTaskId ? Number(searchParams.get('taskId')) : -1

  const { status } = useAppSelector(selectUserTodoTasksState)
  const { follow: followCommunityState } = useAppSelector(selectUserCommunityHandlesState)

  // 执行action操作
  const {
    handleActionToDiscord,
    handleActionToTwitter,
    handleActionQuestionConfirm,
    handleActionQuestionVerifyConfirm,
    handleActionUploadImage,
  } = useHandleAction()

  // 关注社区
  const { status: followCommunityStatus } = followCommunityState
  const handleFollowCommunity = (communityId: number) => {
    dispatch(followCommunity({ id: communityId }))
  }

  // 用户关注的社区ID集合
  const userFollowedCommunityIds = useAppSelector(selectIdsByUserFollowedCommunity).map((item) => Number(item))
  // verify task queue
  const verifingTaskIds = useAppSelector(selectIdsVerifyTaskQueue).map((item) => Number(item))
  // verify action queue
  const verifingActionIds = useAppSelector(selectIdsVerifyActionQueue).map((item) => Number(item))

  // 数据展示
  const todoList = formatStoreDataToComponentDataByTodoList(
    todoItems,
    taskId,
    followCommunityStatus,
    userFollowedCommunityIds,
    verifingTaskIds,
    verifingActionIds,
  )
  const inProgressList = formatStoreDataToComponentDataByInProgressList(
    inProgressItems,
    taskId,
    followCommunityStatus,
    userFollowedCommunityIds,
    verifingTaskIds,
    verifingActionIds,
  )
  const completedList = formatStoreDataToComponentDataByCompletedList(completedItems)
  const wonList = formatStoreDataToComponentDataByWonList(wonItems)
  const lostList = formatStoreDataToComponentDataByLostList(lostItems)
  const closedList = formatStoreDataToComponentDataByClosedList(closedItems)
  const loading = status === AsyncRequestStatus.PENDING

  return (
    <TodoTaskWrapper>
      <TodoTaskGroupBox>
        <TodoTaskGroupLeft>
          <TodoTaskList
            status={TaskTodoCompleteStatus.TODO}
            items={todoList}
            loading={loading}
            onVerifyTask={(task) => dispatch(verifyTask(task))}
            onVerifyAction={(action) => dispatch(verifyAction(action))}
            onDiscord={handleActionToDiscord}
            onTwitter={handleActionToTwitter}
            onFollowCommunity={(action) => handleFollowCommunity(action.communityId)}
            onCustomAction={(action) => dispatch(completionAction(action))}
            onQuestionConfirm={handleActionQuestionConfirm}
            onQuestionVerifyConfirm={handleActionQuestionVerifyConfirm}
            onUploadImage={handleActionUploadImage}
          />
          <TodoTaskList
            status={TaskTodoCompleteStatus.IN_PRGRESS}
            items={inProgressList}
            loading={loading}
            onVerifyTask={(task) => dispatch(verifyTask(task))}
            onVerifyAction={(action) => dispatch(verifyAction(action))}
            onDiscord={handleActionToDiscord}
            onTwitter={handleActionToTwitter}
            onFollowCommunity={(action) => handleFollowCommunity(action.communityId)}
            onCustomAction={(action) => dispatch(completionAction(action))}
            onQuestionConfirm={handleActionQuestionConfirm}
            onQuestionVerifyConfirm={handleActionQuestionVerifyConfirm}
            onUploadImage={handleActionUploadImage}
          />
        </TodoTaskGroupLeft>
        <TodoTaskGroupRight>
          <TodoTaskList
            status={TaskTodoCompleteStatus.COMPLETED}
            items={completedList}
            loading={loading}
            onVerifyTask={(task) => dispatch(verifyTask(task))}
          />
          <TodoTaskList
            status={TaskTodoCompleteStatus.WON}
            items={wonList}
            loading={loading}
            onVerifyTask={(task) => dispatch(verifyTask(task))}
          />
          <TodoTaskList
            status={TaskTodoCompleteStatus.CLOSED}
            items={closedList}
            loading={loading}
            onVerifyTask={(task) => dispatch(verifyTask(task))}
          />
          <TodoTaskList
            status={TaskTodoCompleteStatus.LOST}
            items={lostList}
            loading={loading}
            onVerifyTask={(task) => dispatch(verifyTask(task))}
          />
        </TodoTaskGroupRight>
      </TodoTaskGroupBox>
    </TodoTaskWrapper>
  )
}
export default TodoTask
const TodoTaskWrapper = styled.div`
  width: 100%;
`
const TodoTaskGroupBox = styled.div`
  width: 100%;
  height: 850px;
  display: flex;
  gap: 10px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
    height: auto;
  }
`
const TodoTaskGroupLeft = styled.div`
  flex: 1;
  height: 100%;
  display: grid;
  grid-gap: 10px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(2, minmax(250px, 1fr));
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    grid-template-columns: repeat(1, minmax(250px, 1fr));
  }
`
const TodoTaskGroupRight = styled.div`
  flex: 1;
  height: 100%;
  display: grid;
  grid-gap: 10px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(2, minmax(250px, 1fr));
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    grid-template-columns: repeat(1, minmax(250px, 1fr));
  }
`
