/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:17:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-15 17:55:40
 * @Description: file description
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { selectAccount } from '../features/user/accountSlice'
import ScrollBox from '../components/common/ScrollBox'
import MainContentBox from '../components/layout/MainContentBox'
import { ActionType, TaskTodoCompleteStatus } from '../types/entities'
import { UserActionStatus } from '../types/api'
import { AsyncRequestStatus } from '../types'
import TodoTaskList, { TodoTaskListItemsType } from '../components/business/task/TodoTaskList'
import {
  fetchTodoTasks,
  verifyOneTodoTask,
  selectAll,
  selectUserTodoTasksState,
  TodoTaskItemForEntity,
} from '../features/user/todoTasksSlice'
import { useSearchParams } from 'react-router-dom'
import useHandleAction from '../hooks/useHandleAction'
import {
  follow as followCommunity,
  selectfollow as selectfollowCommunity,
} from '../features/user/communityHandlesSlice'
import { selectIds as selectIdsByUserFollowedProject } from '../features/user/followedCommunitiesSlice'

// TODO 将以下格式化函数合并为一个
const formatStoreDataToComponentDataByTodoList = (
  tasks: TodoTaskItemForEntity[],
  taskId: number,
  followCommunityStatus: AsyncRequestStatus,
  userFollowedProjectIds: number[],
): TodoTaskListItemsType => {
  return tasks.map((task) => {
    const actions = [...task.actions]
      .sort((a, b) => a.orderNum - b.orderNum)
      .map((v) => {
        const action = { ...v, project: task.project }
        // TODO 如果检索到当前action是关注社区的action，且在我关注的社区中，则将其状态改为已完成
        if (action.type === ActionType.TURN_ON_NOTIFICATION && userFollowedProjectIds.includes(action.communityId)) {
          Object.assign(action, {
            status: UserActionStatus.DONE,
          })
        }
        return action
      })
    const loadingRefresh = task.refreshStatus === AsyncRequestStatus.PENDING
    const openActions = task.id === taskId
    let verifyingActions: number[] = []
    if (loadingRefresh) {
      verifyingActions = actions.filter((item) => item.status === UserActionStatus.TODO).map((item) => item.id)
    } else if (followCommunityStatus === AsyncRequestStatus.PENDING) {
      // 如果当前关注社区的请求正在进行中，设定需要loading的action集合
      // TODO 暂时先检索是关注社区的action，(按理说整理应该用find查找communityId)
      verifyingActions = actions.filter((item) => item.type === ActionType.TURN_ON_NOTIFICATION).map((item) => item.id)
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
  userFollowedProjectIds: number[],
): TodoTaskListItemsType => {
  return tasks.map((task) => {
    const actions = [...task.actions]
      .sort((a, b) => a.orderNum - b.orderNum)
      .map((v) => {
        const action = { ...v, project: task.project }
        // TODO 如果检索到当前action是关注社区的action，且在我关注的社区中，则将其状态改为已完成
        if (action.type === ActionType.TURN_ON_NOTIFICATION && userFollowedProjectIds.includes(action.communityId)) {
          Object.assign(action, {
            status: UserActionStatus.DONE,
          })
        }
        return action
      })
    const loadingRefresh = task.refreshStatus === AsyncRequestStatus.PENDING
    const openActions = task.id === taskId
    let verifyingActions: number[] = []
    if (loadingRefresh) {
      verifyingActions = actions.filter((item) => item.status === UserActionStatus.TODO).map((item) => item.id)
    } else if (followCommunityStatus === AsyncRequestStatus.PENDING) {
      // 如果当前关注社区的请求正在进行中，设定需要loading的action集合
      // TODO 暂时先检索是关注社区的action，(按理说整理应该用find查找communityId)
      verifyingActions = actions.filter((item) => item.type === ActionType.TURN_ON_NOTIFICATION).map((item) => item.id)
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
    }
  })
}

const formatStoreDataToComponentDataByWonList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    const displayMint = Boolean(task.project.mintUrl)
    return {
      data: { ...task, actions: [] },
      viewConfig: {
        displayMint,
      },
    }
  })
}

const formatStoreDataToComponentDataByLostList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, actions: [] },
    }
  })
}

const formatStoreDataToComponentDataByClosedList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, actions: [] },
    }
  })
}

const TodoTask: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const hasTaskId = searchParams.has('taskId')
  const taskId = hasTaskId ? Number(searchParams.get('taskId')) : -1
  const dispatch = useAppDispatch()
  const todoTasks = useAppSelector(selectAll)
  const { status } = useAppSelector(selectUserTodoTasksState)

  // 处理单个任务刷新
  const handleRefreshTask = (taskId: number) => {
    dispatch(verifyOneTodoTask({ id: taskId }))
  }

  // 处理执行action操作
  const { handleActionToDiscord, handleActionToTwitter } = useHandleAction()

  // 关注社区
  const { status: followCommunityStatus } = useAppSelector(selectfollowCommunity)
  const handleFollowCommunity = (communityId: number) => {
    console.log({ communityId })

    dispatch(followCommunity({ id: communityId }))
  }
  // 用户关注的社区ID集合
  const userFollowedProjectIds = useAppSelector(selectIdsByUserFollowedProject)

  // 数据分组
  const todoList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.TODO)
  const inProgressList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.IN_PRGRESS)
  const completedList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.COMPLETED)
  const wonList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.WON)
  const lostList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.LOST)
  const closedList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.CLOSED)

  // 数据展示
  const todoItems = formatStoreDataToComponentDataByTodoList(
    todoList,
    taskId,
    followCommunityStatus,
    userFollowedProjectIds.map((item) => Number(item)),
  )
  const inProgressItems = formatStoreDataToComponentDataByInProgressList(
    inProgressList,
    taskId,
    followCommunityStatus,
    userFollowedProjectIds.map((item) => Number(item)),
  )
  const completedItems = formatStoreDataToComponentDataByCompletedList(completedList)
  const wonItems = formatStoreDataToComponentDataByWonList(wonList)
  const lostItems = formatStoreDataToComponentDataByLostList(lostList)
  const closedItems = formatStoreDataToComponentDataByClosedList(closedList)
  const loading = status === AsyncRequestStatus.PENDING

  return (
    <TodoTaskWrapper>
      <ScrollBox>
        <MainContentBox>
          <TodoTaskGroupBox>
            <TodoTaskGroupLeft>
              <TodoTaskList
                status={TaskTodoCompleteStatus.TODO}
                items={todoItems}
                loading={loading}
                onRefreshTask={(task) => handleRefreshTask(task.id)}
                onDiscord={handleActionToDiscord}
                onTwitter={handleActionToTwitter}
                onFollowCommunity={(action) => handleFollowCommunity(action.communityId)}
              />
              <TodoTaskList
                status={TaskTodoCompleteStatus.IN_PRGRESS}
                items={inProgressItems}
                loading={loading}
                onRefreshTask={(task) => handleRefreshTask(task.id)}
                onDiscord={handleActionToDiscord}
                onTwitter={handleActionToTwitter}
                onFollowCommunity={(action) => handleFollowCommunity(action.communityId)}
              />
            </TodoTaskGroupLeft>
            <TodoTaskGroupRight>
              <TodoTaskList
                status={TaskTodoCompleteStatus.COMPLETED}
                items={completedItems}
                loading={loading}
                onRefreshTask={(task) => handleRefreshTask(task.id)}
              />
              <TodoTaskList
                status={TaskTodoCompleteStatus.WON}
                items={wonItems}
                loading={loading}
                onRefreshTask={(task) => handleRefreshTask(task.id)}
              />
              <TodoTaskList
                status={TaskTodoCompleteStatus.CLOSED}
                items={closedItems}
                loading={loading}
                onRefreshTask={(task) => handleRefreshTask(task.id)}
              />
              <TodoTaskList
                status={TaskTodoCompleteStatus.LOST}
                items={lostItems}
                loading={loading}
                onRefreshTask={(task) => handleRefreshTask(task.id)}
              />
            </TodoTaskGroupRight>
          </TodoTaskGroupBox>
        </MainContentBox>
      </ScrollBox>
    </TodoTaskWrapper>
  )
}
export default TodoTask
const TodoTaskWrapper = styled.div`
  width: 100%;
`
const TodoTaskGroupBox = styled.div`
  width: 100%;
  height: 900px;
  display: flex;
  gap: 10px;
`
const TodoTaskGroupLeft = styled.div`
  flex: 1;
  height: 100%;
  display: grid;
  grid-gap: 10px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(2, minmax(250px, 1fr));
`
const TodoTaskGroupRight = styled.div`
  flex: 1;
  height: 100%;
  display: grid;
  grid-gap: 10px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(2, minmax(250px, 1fr));
`
