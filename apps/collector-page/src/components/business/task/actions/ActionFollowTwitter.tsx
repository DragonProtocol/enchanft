/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-14 14:09:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-25 18:32:40
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import TwitterIcon from './icons/twitter.svg'

export type ActionFollowTwitterProps = {
  data: TaskActionItemDataType
  onTwitter?: (callback: () => void) => void
}

const ActionFollowTwitter: React.FC<ActionFollowTwitterProps> = ({ data, onTwitter }: ActionFollowTwitterProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, description, data: actionData, status } = data
  const handleAction = () => {
    window.open(actionData.url)
  }
  return (
    <ActionFollowTwitterWrapper>
      <ActionFollowTwitterLeft isDone={status === UserActionStatus.DONE}>{name}</ActionFollowTwitterLeft>
      {status !== UserActionStatus.DONE && (
        <ActionFollowTwitterIconBtn
          src={TwitterIcon}
          onClick={(event) => {
            // 阻止冒泡
            event.stopPropagation()
            onTwitter && onTwitter(handleAction)
          }}
        ></ActionFollowTwitterIconBtn>
      )}
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
const ActionFollowTwitterLeft = styled.div<{ isDone?: Boolean }>`
  flex: 1;
  ${({ isDone }) => isDone && `text-decoration: line-through;`}
`
const ActionFollowTwitterIconBtn = styled.img`
  cursor: pointer;
`
