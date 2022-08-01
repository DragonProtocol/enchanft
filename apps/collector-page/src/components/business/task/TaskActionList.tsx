/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:45:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 14:38:09
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
  copyBgc?: string
  verifyBgc?: string
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
  copyBgc,
  verifyBgc,
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
              copyBgc={copyBgc}
            />
          ))}
          {displayVerify && (
            <VerifyBtn onClick={onVerifyActionsClick} disabled={disabledVerify} bgc={verifyBgc}>
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
  gap: 20px;
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
const VerifyBtn = styled(ButtonBase)<{ bgc?: string }>`
  width: 100%;
  height: 40px;
  background: ${({ bgc }) => bgc || '#f8f8f8'};
  box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #3dd606;
`