/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:45:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-26 16:03:02
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'

import TaskActionItem, { TaskActionItemDataType } from './TaskActionItem'
export type TaskActionListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
  allowHandle?: boolean
}
export type TaskActionItemsType = TaskActionItemDataType[]
export type TaskActionListProps = TaskActionListViewConfigType & {
  items: TaskActionItemsType
  onTwitter?: (callback: () => void) => void
  onDiscord?: (callback: () => void) => void
}
const TaskActionList: React.FC<TaskActionListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg,
  allowHandle,
  onTwitter,
  onDiscord,
}: TaskActionListProps) => {
  const itemLen = items.length
  return (
    <TaskActionListWrapper>
      {loading ? (
        <TaskActionListLoading>{loadingMsg}</TaskActionListLoading>
      ) : (
        items.map((item) => (
          <TaskActionItem
            key={item.id}
            data={item}
            onDiscord={onDiscord}
            onTwitter={onTwitter}
            allowHandle={allowHandle}
          />
        ))
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
