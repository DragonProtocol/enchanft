/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-18 13:05:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-18 13:15:37
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TodoTaskActionItemDataType } from '../TodoTaskActionItem'

export type ActionFollowCommunityProps = {
  data: TodoTaskActionItemDataType
}

const ActionFollowCommunity: React.FC<ActionFollowCommunityProps> = ({ data }: ActionFollowCommunityProps) => {
  const navigate = useNavigate()
  const { name, orderNum, type, taskId, projectId, communityId, data: actionData, status, progress } = data
  return (
    <ActionFollowCommunityWrapper>
      <ActionFollowCommunityLeft isDone={status === UserActionStatus.DONE}>{name}</ActionFollowCommunityLeft>
      {status !== UserActionStatus.DONE && (
        <ActionFollowCommunityBtn onClick={() => navigate(`/community/${communityId}`)}>
          {'To Join ->'}
        </ActionFollowCommunityBtn>
      )}
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
const ActionFollowCommunityLeft = styled.div<{ isDone?: Boolean }>`
  flex: 1;
  ${({ isDone }) => isDone && `text-decoration: line-through;`}
`
const ActionFollowCommunityBtn = styled.div`
  cursor: pointer;
`
