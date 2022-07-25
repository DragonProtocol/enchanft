/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-25 18:33:01
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import TipIcon from './icons/tip.svg'
import CopyIcon from './icons/copy.svg'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import OverflowEllipsisBox from '../../../common/text/OverflowEllipsisBox'
import TooltipWrapper from '../../../common/TooltipWrapper'

export type ActionInvitePeopleProps = {
  data: TaskActionItemDataType
  onCopy?: (text: string) => void
}

const ActionInvitePeople: React.FC<ActionInvitePeopleProps> = ({ data, onCopy }: ActionInvitePeopleProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, description, data: actionData, status } = data
  const handleCopySuccess = () => {
    if (onCopy) {
      onCopy(actionData.url)
    }
  }
  return (
    <ActionInvitePeopleWrapper>
      <ActionInvitePeopleRow>
        <ActionInvitePeopleLeft isDone={status === UserActionStatus.DONE}>{name}</ActionInvitePeopleLeft>
        {status !== UserActionStatus.DONE && (
          <TooltipWrapper title={description}>
            <ActionInvitePeopleIconBtn src={TipIcon}></ActionInvitePeopleIconBtn>
          </TooltipWrapper>
        )}
      </ActionInvitePeopleRow>
      {status !== UserActionStatus.DONE && (
        <ActionInvitePeopleRow>
          <InviteLinkBox>{actionData.url}</InviteLinkBox>
          <CopyToClipboard text={actionData.url} onCopy={handleCopySuccess}>
            <ActionInvitePeopleIconBtn src={CopyIcon}></ActionInvitePeopleIconBtn>
          </CopyToClipboard>
        </ActionInvitePeopleRow>
      )}
    </ActionInvitePeopleWrapper>
  )
}
export default ActionInvitePeople
const ActionInvitePeopleWrapper = styled.div`
  width: 100%;
`
const ActionInvitePeopleRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`
const ActionInvitePeopleLeft = styled.div<{ isDone?: Boolean }>`
  flex: 1;
  ${({ isDone }) => isDone && `text-decoration: line-through;`}
`
const ActionInvitePeopleIconBtn = styled.img`
  cursor: pointer;
`

const InviteLinkBox = styled(OverflowEllipsisBox)`
  font-size: 12px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.5);
`
