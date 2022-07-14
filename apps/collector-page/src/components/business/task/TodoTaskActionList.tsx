/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:45:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-14 17:52:55
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'

import TodoTaskActionItem, { TodoTaskActionItemDataType } from './TodoTaskActionItem'
export type TodoTaskActionListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type TodoTaskActionItemsType = TodoTaskActionItemDataType[]
export type TodoTaskActionListProps = TodoTaskActionListViewConfigType & {
  items: TodoTaskActionItemsType
}
const TodoTaskActionList: React.FC<TodoTaskActionListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg,
}: TodoTaskActionListProps) => {
  const itemLen = items.length
  return (
    <TodoTaskActionListWrapper>
      {loading ? (
        <TodoTaskActionListLoading>{loadingMsg}</TodoTaskActionListLoading>
      ) : (
        items.map((item) => <TodoTaskActionItem key={item.id} data={item} />)
      )}

      {!loading && itemLen === 0 && emptyMsg && <TodoTaskActionListEmpty>{emptyMsg}</TodoTaskActionListEmpty>}
    </TodoTaskActionListWrapper>
  )
}
export default TodoTaskActionList
const TodoTaskActionListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`
const TodoTaskActionListLoading = styled.div`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`
const TodoTaskActionListEmpty = styled.div`
  text-align: center;
  margin-top: 20px;
`
