/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-14 14:09:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-05 16:25:58
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import IconTwitter from '../../../common/icons/IconTwitter'

export type ActionFollowTwitterProps = {
  data: TaskActionItemDataType
  allowHandle?: boolean
  onTwitter?: (callback: () => void) => void
}

const ActionFollowTwitter: React.FC<ActionFollowTwitterProps> = ({
  data,
  allowHandle,
  onTwitter,
}: ActionFollowTwitterProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, description, data: actionData, status } = data
  const isDone = status === UserActionStatus.DONE
  const handleAction = () => {
    const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=1000,height=1000,left=0,top=0`
    window.open(actionData.url, name, winParams)
  }
  const clickAction = () => {
    if (!allowHandle || isDone) return
    onTwitter && onTwitter(handleAction)
  }
  return (
    <ActionFollowTwitterWrapper>
      <ActionIconBox isDone={isDone} onClick={clickAction}>
        <IconTwitter opacity={isDone ? 0.5 : 1} />
      </ActionIconBox>
      <ActionContentBox isDone={isDone} onClick={clickAction}>
        {name}
      </ActionContentBox>
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
const ActionContentBox = styled.div<{ isDone?: Boolean }>`
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
const ActionIconBox = styled.div<{ isDone?: Boolean }>`
  ${({ isDone }) => !isDone && `cursor: pointer;`}
`
