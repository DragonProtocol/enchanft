/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-05 16:39:35
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import IconDiscord from '../../../common/icons/IconDiscord'

export type ActionDiscordInvitesPeopleProps = {
  data: TaskActionItemDataType
  allowHandle?: boolean
  onDiscord?: (callback: () => void) => void
}

const ActionDiscordInvitesPeople: React.FC<ActionDiscordInvitesPeopleProps> = ({
  data,
  allowHandle,
  onDiscord,
}: ActionDiscordInvitesPeopleProps) => {
  const { name, progress, orderNum, type, taskId, projectId, communityId, data: actionData, status } = data
  const isDone = status === UserActionStatus.DONE
  const handleAction = () => {
    const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=1000,height=1000,left=0,top=0`
    window.open(actionData.url, name, winParams)
  }
  const clickAction = () => {
    if (!allowHandle || isDone) return
    onDiscord && onDiscord(handleAction)
  }
  return (
    <ActionDiscordInvitesPeopleWrapper>
      <ActionIcon isDone={isDone} onClick={clickAction}>
        <IconDiscord opacity={isDone ? 0.5 : 1} />
      </ActionIcon>
      <ActionContentBox isDone={isDone} onClick={clickAction}>
        {name} {progress && progress != '' && <ProgressSpan>({progress})</ProgressSpan>}
      </ActionContentBox>
    </ActionDiscordInvitesPeopleWrapper>
  )
}
export default ActionDiscordInvitesPeople
const ActionDiscordInvitesPeopleWrapper = styled.div`
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
const ActionIcon = styled.div<{ isDone?: Boolean }>`
  ${({ isDone }) => !isDone && `cursor: pointer;`}
`
const ProgressSpan = styled.span`
  color: rgba(51, 51, 51, 0.5);
`
