/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-14 14:09:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-14 18:09:51
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TodoTaskActionItemDataType } from '../TodoTaskActionItem'
import FollowTwitterIcon from './icons/followTwitter.svg'

export type ActionFollowTwitterProps = {
  data: TodoTaskActionItemDataType
}

const ActionFollowTwitter: React.FC<ActionFollowTwitterProps> = ({ data }: ActionFollowTwitterProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, data: actionData, status, progress } = data
  // 点解关注twitter
  const handleFollowTwitter = () => {}
  return (
    <ActionFollowTwitterWrapper>
      <ActionFollowTwitterLeft isDone={status === UserActionStatus.DONE}>{name}</ActionFollowTwitterLeft>
      {status !== UserActionStatus.DONE && (
        <a
          href={actionData.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            // 阻止冒泡
            event.stopPropagation()
          }}
        >
          <ActionFollowTwitterIconBtn src={FollowTwitterIcon}></ActionFollowTwitterIconBtn>
        </a>
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
const ActionFollowTwitterIconBtn = styled.img``
