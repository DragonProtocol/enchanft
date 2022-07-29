/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-14 14:09:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 15:17:26
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import IconTwitter from '../../../common/icons/IconTwitter'

export type ActionFollowTwitterProps = {
  data: TaskActionItemDataType
  onTwitter?: (callback: () => void) => void
}

const ActionFollowTwitter: React.FC<ActionFollowTwitterProps> = ({ data, onTwitter }: ActionFollowTwitterProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, description, data: actionData, status } = data
  const isDone = status === UserActionStatus.DONE
  const handleAction = () => {
    const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=1000,height=1000,left=0,top=0`
    window.open(actionData.url, name, winParams)
  }
  const clickAction = () => {
    if (isDone) return
    onTwitter && onTwitter(handleAction)
  }
  return (
    <ActionFollowTwitterWrapper>
      <ActionLeft isDone={isDone} onClick={clickAction}>
        {name}
      </ActionLeft>
      <ActionRight isDone={isDone} onClick={clickAction}>
        <IconTwitter opacity={isDone ? 0.5 : 1} />
      </ActionRight>
    </ActionFollowTwitterWrapper>
  )
}
export default ActionFollowTwitter
const ActionFollowTwitterWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`
const ActionLeft = styled.div<{ isDone?: Boolean }>`
  flex: 1;
  ${({ isDone }) =>
    isDone
      ? `
        text-decoration-line: line-through;
        color: #333333;
        opacity: 0.5;  
      `
      : `
        cursor: pointer;
      `}
`
const ActionRight = styled.div<{ isDone?: Boolean }>`
  ${({ isDone }) => !isDone && `cursor: pointer;`}
`
