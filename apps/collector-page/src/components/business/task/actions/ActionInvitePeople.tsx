/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 15:49:23
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import OverflowEllipsisBox from '../../../common/text/OverflowEllipsisBox'
import TooltipWrapper from '../../../common/TooltipWrapper'
import IconTip from '../../../common/icons/IconTip'
import IconCopy from '../../../common/icons/IconCopy'
import { getTakeTaskRefLink } from '../../../../container/Ref'
import { useAppSelector } from '../../../../store/hooks'
import { selectAccount } from '../../../../features/user/accountSlice'

export type ActionInvitePeopleProps = {
  data: TaskActionItemDataType
  onCopy?: (text: string) => void
  copyBgc?: string
}

const ActionInvitePeople: React.FC<ActionInvitePeopleProps> = ({ data, onCopy, copyBgc }: ActionInvitePeopleProps) => {
  const account = useAppSelector(selectAccount)
  const { name, progress, orderNum, type, taskId, projectId, communityId, description, data: actionData, status } = data
  const refUrl = getTakeTaskRefLink(account.id, taskId)
  const isDone = status === UserActionStatus.DONE
  const handleCopySuccess = () => {
    console.log('Copy url: ',refUrl)
    if (onCopy) {
      onCopy(refUrl)
    }
  }
  return (
    <ActionInvitePeopleWrapper>
      <ActionInvitePeopleRow>
        <ActionInvitePeopleLeft isDone={isDone}>{name} ({progress})</ActionInvitePeopleLeft>
        <TooltipWrapper title={description}>
          <IconTip opacity={isDone ? 0.5 : 1} />
        </TooltipWrapper>
      </ActionInvitePeopleRow>
      <ActionInviteCopyBox bgc={copyBgc}>
        <InviteLinkBox>{refUrl}</InviteLinkBox>
        <CopyToClipboard text={refUrl} onCopy={handleCopySuccess}>
          <button><IconCopy opacity={isDone ? 0.5 : 1} size="1.2rem"/></button>
        </CopyToClipboard>
      </ActionInviteCopyBox>
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
  gap: 12px;
`
const ActionInvitePeopleLeft = styled.div<{ isDone?: Boolean }>`
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
const ActionInviteCopyBox = styled.div<{ bgc?: string }>`
  width: 100%;
  background: ${({ bgc }) => bgc || '#f8f8f8'};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-top: 6px;
  padding: 5px;
  box-sizing: border-box;
`
const InviteLinkBox = styled(OverflowEllipsisBox)`
  font-size: 12px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.5);
`
