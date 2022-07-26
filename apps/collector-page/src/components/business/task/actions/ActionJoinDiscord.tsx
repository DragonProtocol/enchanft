/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-26 16:36:22
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import DiscordIcon from './icons/discord.svg'

export type ActionJoinDiscordProps = {
  data: TaskActionItemDataType
  onDiscord?: (callback: () => void) => void
}

const ActionJoinDiscord: React.FC<ActionJoinDiscordProps> = ({ data, onDiscord }: ActionJoinDiscordProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, data: actionData, status } = data
  const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
  width=1000,height=1000,left=0,top=0`
  const handleAction = () => {
    window.open(actionData.url, name, winParams)
  }
  return (
    <ActionJoinDiscordWrapper>
      <ActionJoinDiscordLeft isDone={status === UserActionStatus.DONE}>{name}</ActionJoinDiscordLeft>
      {status !== UserActionStatus.DONE && (
        <ActionJoinDiscordIconBtn
          src={DiscordIcon}
          onClick={(event) => {
            // 阻止冒泡
            event.stopPropagation()
            onDiscord && onDiscord(handleAction)
          }}
        ></ActionJoinDiscordIconBtn>
      )}
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
const ActionJoinDiscordLeft = styled.div<{ isDone?: Boolean }>`
  flex: 1;
  ${({ isDone }) => isDone && `text-decoration: line-through;`}
`
const ActionJoinDiscordIconBtn = styled.img`
  cursor: pointer;
`