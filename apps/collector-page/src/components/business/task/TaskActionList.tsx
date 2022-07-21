/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:45:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-21 18:21:18
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'

import TaskActionItem, { TaskActionItemDataType } from './TaskActionItem'
export type TaskActionListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
}
export type TaskActionItemsType = TaskActionItemDataType[]
export type TaskActionListProps = TaskActionListViewConfigType & {
  items: TaskActionItemsType
}
const TaskActionList: React.FC<TaskActionListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg,
}: TaskActionListProps) => {
  const itemLen = items.length
  return (
    <TaskActionListWrapper>
      {loading ? (
        <TaskActionListLoading>{loadingMsg}</TaskActionListLoading>
      ) : (
        items.map((item) => <TaskActionItem key={item.id} data={item} />)
      )}

      {!loading && itemLen === 0 && emptyMsg && <TaskActionListEmpty>{emptyMsg}</TaskActionListEmpty>}
    </TaskActionListWrapper>
  )
}
export default TaskActionList
const TaskActionListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`
const TaskActionListLoading = styled.div`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`
const TaskActionListEmpty = styled.div`
  text-align: center;
  margin-top: 20px;
`
