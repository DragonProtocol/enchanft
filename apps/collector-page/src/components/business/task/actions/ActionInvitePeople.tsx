/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-02 17:39:57
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
import { useEffect } from 'react'
import { useState } from 'react'

export type ActionInvitePeopleProps = {
  data: TaskActionItemDataType
  onCopy?: (text: string) => void
  copyBgc?: string
}

const ActionInvitePeople: React.FC<ActionInvitePeopleProps> = ({ data, onCopy, copyBgc }: ActionInvitePeopleProps) => {
  const account = useAppSelector(selectAccount)
  const { name, progress, orderNum, type, taskId, projectId, communityId, description, data: actionData, status } = data
  const [refUrl, setRefUrl] = useState('')

  useEffect(() => {
    if (account.id > 0) {
      const url = getTakeTaskRefLink(account.id, taskId)
      setRefUrl(url)
    }
  }, [account])

  const isDone = status === UserActionStatus.DONE
  const handleCopySuccess = () => {
    if (onCopy) {
      onCopy(refUrl)
    }
  }
  return (
    <ActionInvitePeopleWrapper>
      <ActionIconBox>
        <TooltipWrapper title={description}>
          <IconTip opacity={isDone ? 0.5 : 1} />
        </TooltipWrapper>
      </ActionIconBox>
      <ActionContentBox isDone={isDone}>
        {name} {progress && progress != '' && <ProgressSpan>({progress})</ProgressSpan>}
        <ActionInviteCopyBox bgc={copyBgc}>
          <InviteLinkBox>{refUrl}</InviteLinkBox>
          <CopyToClipboard text={refUrl} onCopy={handleCopySuccess}>
            <CopyBtn>
              <IconCopy opacity={isDone ? 0.5 : 1} size="1.2rem" />
            </CopyBtn>
          </CopyToClipboard>
        </ActionInviteCopyBox>
      </ActionContentBox>
    </ActionInvitePeopleWrapper>
  )
}
export default ActionInvitePeople
const ActionInvitePeopleWrapper = styled.div`
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
const ProgressSpan = styled.span`
  color: rgba(51, 51, 51, 0.5);
`

const ActionIconBox = styled.div<{ isDone?: Boolean }>`
  ${({ isDone }) => !isDone && `cursor: pointer;`}
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
const CopyBtn = styled.div`
  cursor: pointer;
`
