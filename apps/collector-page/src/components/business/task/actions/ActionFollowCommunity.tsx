/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-18 13:05:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-08 11:28:51
 * @Description: file description
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import IconNotify from '../../../common/icons/IconNotify'
import ActionIconBox from './ActionIconBox'
import ActionNameSpan from './ActionNameSpan'
export type ActionFollowCommunityProps = {
  data: TaskActionItemDataType
  allowHandle?: boolean
  onFollowCommunity?: (action: TaskActionItemDataType) => void
}

const ActionFollowCommunity: React.FC<ActionFollowCommunityProps> = ({
  data,
  allowHandle,
  onFollowCommunity,
}: ActionFollowCommunityProps) => {
  const navigate = useNavigate()
  const { name, orderNum, type, taskId, projectId, communityId, data: actionData, status, description, project } = data
  const isDone = status === UserActionStatus.DONE
  const handleAction = () => {
    if (!project?.slug || !allowHandle || isDone) return
    navigate(`/${project.slug}`)
  }
  const handleFollowCommunity = () => {
    if (!allowHandle || isDone) return
    if (onFollowCommunity) onFollowCommunity(data)
  }

  return (
    <ActionFollowCommunityWrapper>
      <ActionIconBox allowHandle={allowHandle} isDone={isDone} onClick={handleFollowCommunity}>
        <IconNotify opacity={isDone ? 0.5 : 1} />
      </ActionIconBox>
      <ActionContentBox onClick={handleAction}>
        <ActionNameSpan allowHandle={allowHandle} isDone={isDone}>
          {name}
        </ActionNameSpan>
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
const ActionContentBox = styled.div`
  flex: 1;
`
