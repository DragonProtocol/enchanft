/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:25:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-02 14:50:09
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'
import { TaskTodoCompleteStatus } from '../../../types/api'
import Loading from '../../common/loading/Loading'

import TodoTaskItem, { TodoTaskItemDataViewType, TodoTaskItemHandlesType } from './TodoTaskItem'
export type TodoTaskListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type TodoTaskListItemsType = TodoTaskItemDataViewType[]
export type TodoTaskListProps = TodoTaskListViewConfigType &
  TodoTaskItemHandlesType & {
    status: TaskTodoCompleteStatus
    items: TodoTaskListItemsType
  }

export const todoTaskCompleteStatusMap = {
  [TaskTodoCompleteStatus.TODO]: {
    title: 'to do',
    titleBgc: '#3DD606',
    bodyBgc: 'rgba(61, 214, 6, 0.1)',
  },
  [TaskTodoCompleteStatus.IN_PRGRESS]: {
    title: 'in progress',
    titleBgc: '#EBB700',
    bodyBgc: 'rgba(235, 183, 0, 0.1)',
  },
  [TaskTodoCompleteStatus.COMPLETED]: {
    title: 'completed',
    titleBgc: '#46B6DA',
    bodyBgc: 'rgba(70, 182, 218, 0.1)',
  },
  [TaskTodoCompleteStatus.WON]: {
    title: 'won',
    titleBgc: '#E07031',
    bodyBgc: 'rgba(224, 112, 49, 0.1)',
  },
  [TaskTodoCompleteStatus.LOST]: {
    title: 'lost',
    titleBgc: '#8C73D6',
    bodyBgc: 'rgba(140, 115, 214, 0.1)',
  },
  [TaskTodoCompleteStatus.CLOSED]: {
    title: 'closed',
    titleBgc: '#ADADAD',
    bodyBgc: 'rgba(173, 173, 173, 0.1)',
  },
}
const TodoTaskList: React.FC<TodoTaskListProps> = ({
  status,
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg,
  onMint,
  onRefreshTask,
  onTwitter,
  onDiscord,
}: TodoTaskListProps) => {
  const itemLen = items.length
  const title = todoTaskCompleteStatusMap[status].title || 'task list'
  const titleBgc = todoTaskCompleteStatusMap[status].titleBgc || 'rgba(16, 16, 16, 100)'
  const bodyBgc = todoTaskCompleteStatusMap[status].bodyBgc || 'rgba(173, 173, 173, 0.1)'
  return (
    <TodoTaskListWrapper>
      <TodoTaskListHeader bgc={titleBgc}>
        {title} ({itemLen})
      </TodoTaskListHeader>
      <TodoTaskListBody bgc={bodyBgc}>
        {loading ? (
          <TodoTaskListLoading>
            <Loading />
          </TodoTaskListLoading>
        ) : (
          items.map((item) => (
            <TodoTaskItem
              key={item.data.id}
              data={item.data}
              viewConfig={item.viewConfig}
              onMint={onMint}
              onRefreshTask={onRefreshTask}
              onDiscord={onDiscord}
              onTwitter={onTwitter}
            />
          ))
        )}

        {!loading && itemLen === 0 && emptyMsg && <TodoTaskListEmpty>{emptyMsg}</TodoTaskListEmpty>}
      </TodoTaskListBody>
    </TodoTaskListWrapper>
  )
}
export default TodoTaskList
const TodoTaskListWrapper = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const TodoTaskListHeader = styled.div<{ bgc?: string }>`
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: ${(props) => props.bgc || 'rgba(16, 16, 16, 100)'};
  font-weight: 700;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
  text-transform: capitalize;
`
const TodoTaskListBody = styled.div<{ bgc?: string }>`
  flex: 1;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: ${(props) => props.bgc || 'rgba(173, 173, 173, 0.1)'};
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  ${ScrollBarCss}
`
const TodoTaskListLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const TodoTaskListEmpty = styled.div`
  text-align: center;
  margin-top: 20px;
`
