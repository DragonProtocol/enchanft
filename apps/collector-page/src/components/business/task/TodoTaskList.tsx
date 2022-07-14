/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:25:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-14 17:22:56
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { ScrollBarCss } from '../../../GlobalStyle'

import TodoTaskItem, { TodoTaskItemDataViewType, TodoTaskItemHandlesType } from './TodoTaskItem'
export type TodoTaskListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type TodoTaskListItemsType = TodoTaskItemDataViewType[]
export type TodoTaskListProps = TodoTaskListViewConfigType &
  TodoTaskItemHandlesType & {
    title: string
    items: TodoTaskListItemsType
  }
const TodoTaskList: React.FC<TodoTaskListProps> = ({
  title = 'Task List',
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg,
  onMint,
}: TodoTaskListProps) => {
  const itemLen = items.length
  return (
    <TodoTaskListWrapper>
      <TodoTaskListHeader>
        {title} ({itemLen})
      </TodoTaskListHeader>
      <TodoTaskListBody>
        {loading ? (
          <TodoTaskListLoading>{loadingMsg}</TodoTaskListLoading>
        ) : (
          items.map((item) => <TodoTaskItem data={item.data} viewConfig={item.viewConfig} onMint={onMint} />)
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
  border: 1px solid rgba(16, 16, 16, 100);
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const TodoTaskListHeader = styled.div`
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: rgba(16, 16, 16, 100);
  color: rgba(255, 255, 255, 100);
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
`
const TodoTaskListBody = styled.div`
  flex: 1;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  ${ScrollBarCss}
`
const TodoTaskListLoading = styled.div`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`
const TodoTaskListEmpty = styled.div`
  text-align: center;
  margin-top: 20px;
`
