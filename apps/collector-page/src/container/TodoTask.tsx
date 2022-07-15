/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:17:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-15 14:43:12
 * @Description: file description
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { selectAccount } from '../features/user/accountSlice'
import ScrollBox from '../components/common/ScrollBox'
import MainContentBox from '../components/layout/MainContentBox'
import { TaskTodoCompleteStatus } from '../types/api'
import { AsyncRequestStatus } from '../types'
import TodoTaskList, { TodoTaskListItemsType } from '../components/business/task/TodoTaskList'
import {
  fetchTodoTasks,
  refreshTodoTasksOne,
  selectAll,
  selectUserTodoTasksState,
  TodoTaskItemForEntity,
} from '../features/user/todoTasksSlice'

const formatStoreDataToComponentDataByTodoList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task },
      viewConfig: {
        allowOpenActions: true,
      },
    }
  })
}
const formatStoreDataToComponentDataByInProgressList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task },
      viewConfig: {
        allowOpenActions: true,
      },
    }
  })
}

const formatStoreDataToComponentDataByCompletedList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task },
    }
  })
}

const formatStoreDataToComponentDataByWonList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task },
      viewConfig: {
        displayMint: true,
      },
    }
  })
}

const formatStoreDataToComponentDataByLostList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task },
    }
  })
}

const formatStoreDataToComponentDataByClosedList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task },
    }
  })
}

const TodoTask: React.FC = () => {
  const { token } = useAppSelector(selectAccount)
  const dispatch = useAppDispatch()
  const todoTasks = useAppSelector(selectAll)
  const { status } = useAppSelector(selectUserTodoTasksState)
  useEffect(() => {
    if (token) {
      dispatch(fetchTodoTasks())
    }
  }, [token])

  // 数据分组
  const todoList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.TODO)
  const inProgressList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.IN_PRGRESS)
  const completedList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.COMPLETED)
  const wonList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.WON)
  const lostList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.LOST)
  const closedList = todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.CLOSED)

  // 数据展示
  const todoItems = formatStoreDataToComponentDataByTodoList(todoList)
  const inProgressItems = formatStoreDataToComponentDataByInProgressList(inProgressList)
  const completedItems = formatStoreDataToComponentDataByCompletedList(completedList)
  const wonItems = formatStoreDataToComponentDataByWonList(wonList)
  const lostItems = formatStoreDataToComponentDataByLostList(lostList)
  const closedItems = formatStoreDataToComponentDataByClosedList(closedList)
  const loading = status === AsyncRequestStatus.PENDING

  // 处理单个任务刷新
  const handleRefreshTask = (taskId: number) => {
    dispatch(refreshTodoTasksOne({ id: taskId }))
  }
  return (
    <TodoTaskWrapper>
      <ScrollBox>
        <MainContentBox>
          <TodoTaskGroupBox>
            <TodoTaskGroupLeft>
              <TodoTaskList
                title={'to do'}
                items={todoItems}
                loading={loading}
                onRefreshTask={(task) => handleRefreshTask(task.id)}
              />
              <TodoTaskList
                title={'in progress'}
                items={inProgressItems}
                loading={loading}
                onRefreshTask={(task) => handleRefreshTask(task.id)}
              />
            </TodoTaskGroupLeft>
            <TodoTaskGroupRight>
              <TodoTaskList
                title={'completed'}
                items={completedItems}
                loading={loading}
                onRefreshTask={(task) => handleRefreshTask(task.id)}
              />
              <TodoTaskList
                title={'won'}
                items={wonItems}
                loading={loading}
                onRefreshTask={(task) => handleRefreshTask(task.id)}
              />
              <TodoTaskList
                title={'closed'}
                items={lostItems}
                loading={loading}
                onRefreshTask={(task) => handleRefreshTask(task.id)}
              />
              <TodoTaskList
                title={'lost'}
                items={closedItems}
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
  height: 100%;
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
