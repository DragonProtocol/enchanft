/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 15:18:06
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import IconDiscord from '../../../common/icons/IconDiscord'

export type ActionJoinDiscordProps = {
  data: TaskActionItemDataType
  onDiscord?: (callback: () => void) => void
}

const ActionJoinDiscord: React.FC<ActionJoinDiscordProps> = ({ data, onDiscord }: ActionJoinDiscordProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, data: actionData, status } = data
  const isDone = status === UserActionStatus.DONE
  const handleAction = () => {
    const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=1000,height=1000,left=0,top=0`
    window.open(actionData.url, name, winParams)
  }
  const clickAction = () => {
    if (isDone) return
    onDiscord && onDiscord(handleAction)
  }
  return (
    <ActionJoinDiscordWrapper>
      <ActionLeft isDone={isDone} onClick={clickAction}>
        {name}
      </ActionLeft>
      <ActionRight isDone={isDone} onClick={clickAction}>
        <IconDiscord opacity={isDone ? 0.5 : 1} />
      </ActionRight>
    </ActionJoinDiscordWrapper>
  )
}
export default ActionJoinDiscord
const ActionJoinDiscordWrapper = styled.div`
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
