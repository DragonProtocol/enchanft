/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:45:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-27 12:38:14
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import ButtonBase from '../../common/button/ButtonBase'

import TaskActionItem, { TaskActionItemDataType } from './TaskActionItem'
export type TaskActionListViewConfigType = {
  loading?: boolean
  loadingMsg?: string
  emptyMsg?: string
  allowHandle?: boolean
  displayVerify?: boolean
  disabledVerify?: boolean
  loadingVerify?: boolean
  loadingVerifyMsg?: string
}
export type TaskActionItemsType = TaskActionItemDataType[]
export type TaskActionListProps = TaskActionListViewConfigType & {
  items: TaskActionItemsType
  onTwitter?: (callback: () => void) => void
  onDiscord?: (callback: () => void) => void
  onVerifyActions?: () => void
}
const TaskActionList: React.FC<TaskActionListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg,
  allowHandle,
  onTwitter,
  onDiscord,
  onVerifyActions,
  displayVerify,
  disabledVerify,
  loadingVerify,
  loadingVerifyMsg = 'verifying...',
}: TaskActionListProps) => {
  const itemLen = items.length
  const onVerifyActionsClick = () => {
    if (onVerifyActions) {
      onVerifyActions()
    }
  }
  const verifyText = loadingVerify ? loadingVerifyMsg : 'Verify'
  return (
    <TaskActionListWrapper>
      {loading ? (
        <TaskActionListLoading>{loadingMsg}</TaskActionListLoading>
      ) : (
        <>
          {items.map((item) => (
            <TaskActionItem
              key={item.id}
              data={item}
              onDiscord={onDiscord}
              onTwitter={onTwitter}
              allowHandle={allowHandle}
            />
          ))}
          {displayVerify && (
            <VerifyBtn onClick={onVerifyActionsClick} disabled={disabledVerify}>
              {verifyText}
            </VerifyBtn>
          )}
        </>
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
const VerifyBtn = styled(ButtonBase)`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  background-color: rgba(16, 16, 16, 100);
  color: rgba(255, 255, 255, 100);
  font-size: 14px;
  margin-top: 10px;
`
