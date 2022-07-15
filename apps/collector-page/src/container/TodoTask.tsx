/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:17:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-14 18:02:33
 * @Description: file description
 */
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import styled from 'styled-components'
import { selectAccount } from '../features/user/accountSlice'
import ScrollBox from '../components/common/ScrollBox'
import MainContentBox from '../components/layout/MainContentBox'
import { TaskAcceptedStatus } from '../types/api'
import { AsyncRequestStatus } from '../types'
import TodoTaskList, { TodoTaskListItemsType } from '../components/business/task/TodoTaskList'
import {
  fetchTodoTasks,
  selectAllForClosedList,
  selectAllForCompletedList,
  selectAllForInProgressList,
  selectAllForLostList,
  selectAllForTodoList,
  selectAllForWonList,
  selectUserTodoTasksState,
  TodoTaskItemForEntity,
} from '../features/user/todoTasksSlice'
import { selectUserTaskHandlesState } from '../features/user/taskHandlesSlice'
import { TodoTaskCompleteStatus } from '../components/business/task/TodoTaskItem'

const formatStoreDataToComponentDataByTodoList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, completeStatus: TodoTaskCompleteStatus.TODO },
      viewConfig: {
        allowOpenActions: true,
      },
    }
  })
}
const formatStoreDataToComponentDataByInProgressList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, completeStatus: TodoTaskCompleteStatus.IN_PRGRESS },
      viewConfig: {
        allowOpenActions: true,
      },
    }
  })
}

const formatStoreDataToComponentDataByCompletedList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, completeStatus: TodoTaskCompleteStatus.COMPLETED },
    }
  })
}

const formatStoreDataToComponentDataByWonList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, completeStatus: TodoTaskCompleteStatus.WON },
      viewConfig: {
        displayMint: true,
      },
    }
  })
}

const formatStoreDataToComponentDataByLostList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, completeStatus: TodoTaskCompleteStatus.LOST },
    }
  })
}

const formatStoreDataToComponentDataByClosedList = (tasks: TodoTaskItemForEntity[]): TodoTaskListItemsType => {
  return tasks.map((task) => {
    return {
      data: { ...task, completeStatus: TodoTaskCompleteStatus.CLOSED },
    }
  })
}

const TodoTask: React.FC = () => {
  const { token } = useAppSelector(selectAccount)
  const dispatch = useAppDispatch()
  // todoList
  const todoList = useAppSelector(selectAllForTodoList)
  // inProgressList
  const inProgressList = useAppSelector(selectAllForInProgressList)
  // completedList
  const completedList = useAppSelector(selectAllForCompletedList)
  // wonList
  const wonList = useAppSelector(selectAllForWonList)
  // lostList
  const lostList = useAppSelector(selectAllForLostList)
  // closedList
  const closedList = useAppSelector(selectAllForClosedList)
  // UserTodoTasksState
  const { status } = useAppSelector(selectUserTodoTasksState)

  useEffect(() => {
    if (token) {
      dispatch(fetchTodoTasks())
    }
  }, [token])
  // 展示数据
  const loading = status === AsyncRequestStatus.PENDING
  const todoItems = formatStoreDataToComponentDataByTodoList(todoList)
  const inProgressItems = formatStoreDataToComponentDataByInProgressList(inProgressList)
  const completedItems = formatStoreDataToComponentDataByCompletedList(completedList)
  const wonItems = formatStoreDataToComponentDataByWonList(wonList)
  const lostItems = formatStoreDataToComponentDataByLostList(lostList)
  const closedItems = formatStoreDataToComponentDataByClosedList(closedList)
  console.log({
    todoItems,
  })

  return (
    <TodoTaskWrapper>
      <ScrollBox>
        <MainContentBox>
          <TodoTaskGroupBox>
            <TodoTaskGroupLeft>
              <TodoTaskList title={'to do'} items={todoItems} loading={loading} />
              <TodoTaskList title={'in progress'} items={inProgressItems} loading={loading} />
            </TodoTaskGroupLeft>
            <TodoTaskGroupRight>
              <TodoTaskList title={'completed'} items={completedItems} loading={loading} />
              <TodoTaskList title={'won'} items={wonItems} loading={loading} />
              <TodoTaskList title={'closed'} items={lostItems} loading={loading} />
              <TodoTaskList title={'lost'} items={closedItems} loading={loading} />
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
