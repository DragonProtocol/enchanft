/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-18 13:05:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-05 13:39:04
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
  onFollowCommunity?: (action: TaskActionItemDataType) => void
}

const ActionFollowCommunity: React.FC<ActionFollowCommunityProps> = ({
  data,
  onFollowCommunity,
}: ActionFollowCommunityProps) => {
  const navigate = useNavigate()
  const { name, orderNum, type, taskId, projectId, communityId, data: actionData, status, description, project } = data
  const isDone = status === UserActionStatus.DONE
  const handleAction = () => {
    if (isDone) return
    navigate(`/${project.slug}`)
  }
  const handleFollowCommunity = () => {
    if (isDone) return
    if (onFollowCommunity) onFollowCommunity(data)
  }
  return (
    <ActionFollowCommunityWrapper>
      <ActionIconBox isDone={isDone} onClick={handleFollowCommunity}>
        <IconNotify opacity={isDone ? 0.5 : 1} />
      </ActionIconBox>
      <ActionContentBox isDone={isDone} onClick={handleAction}>
        {name}
      </ActionContentBox>
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
