/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-14 14:09:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-11 17:56:15
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import IconTwitter from '../../../common/icons/IconTwitter'
import ActionIconBox from './ActionIconBox'
import ActionNameSpan from './ActionNameSpan'
import { getTwitterFollowLink } from '../../../../utils/twitter'

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
  const accounts = actionData?.accounts || []

  const clickAction = (name: string) => {
    if (!allowHandle || isDone) return
    const url = getTwitterFollowLink(name)
    const handleAction = () => {
      const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
      width=1000,height=1000,left=0,top=0`
      window.open(url, name, winParams)
    }
    onTwitter && onTwitter(handleAction)
  }
  return (
    <ActionFollowTwitterWrapper>
      <ActionIconBox allowHandle={allowHandle} isDone={isDone}>
        <IconTwitter opacity={isDone ? 0.5 : 1} />
      </ActionIconBox>
      <ActionContentBox>
        <FollowTwitterTitle allowHandle={allowHandle} isDone={isDone}>
          Follow{' '}
          {accounts.map((item, index) => (
            <>
              <TwitterLink key={index} onClick={() => clickAction(item)}>
                {'@' + item}
              </TwitterLink>
              {index < accounts.length - 1 ? ' , ' : ''}
            </>
          ))}{' '}
          on Twitter
        </FollowTwitterTitle>
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
const ActionContentBox = styled.div`
  flex: 1;
`
const FollowTwitterTitle = styled(ActionNameSpan)`
  cursor: auto;
  /* 鼠标浮上加下划线 */
  &:hover {
    text-decoration-line: none;
  }
  /* 鼠标点下整体变绿色 */
  &:active {
    color: inherit;
  }
`
const TwitterLink = styled.a`
  cursor: pointer;
  &:hover {
    /* color: #4c91f0; */
    text-decoration-line: underline;
  }
  /* 鼠标点下整体变绿色 */
  &:active {
    color: #3dd606;
  }
`
