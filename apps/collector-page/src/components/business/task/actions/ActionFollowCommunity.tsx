/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-18 13:05:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 15:16:09
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import IconNotify from '../../../common/icons/IconNotify'
export type ActionFollowCommunityProps = {
  data: TaskActionItemDataType
}

const ActionFollowCommunity: React.FC<ActionFollowCommunityProps> = ({ data }: ActionFollowCommunityProps) => {
  const navigate = useNavigate()
  const { name, orderNum, type, taskId, projectId, communityId, data: actionData, status, description } = data
  const isDone = status === UserActionStatus.DONE
  const handleAction = () => {
    if (isDone) return
    navigate(`/community/${communityId}`)
  }
  return (
    <ActionFollowCommunityWrapper>
      <ActionLeft isDone={isDone} onClick={handleAction}>
        {name}
      </ActionLeft>
      <ActionRight isDone={isDone} onClick={handleAction}>
        <IconNotify opacity={isDone ? 0.5 : 1} />
      </ActionRight>
    </ActionFollowCommunityWrapper>
  )
}
export default ActionFollowCommunity
const ActionFollowCommunityWrapper = styled.div`
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
