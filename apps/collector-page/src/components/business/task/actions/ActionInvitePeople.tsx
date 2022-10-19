/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-19 18:03:09
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import OverflowEllipsisBox from '../../../common/text/OverflowEllipsisBox'
import TooltipWrapper from '../../../common/tooltip/TooltipWrapper'
import IconWL from '../../../common/icons/IconWL'
import IconCopy from '../../../common/icons/IconCopy'
import { getTakeTaskRefLink } from '../../../../container/Ref'
import { useAppSelector } from '../../../../store/hooks'
import { useEffect } from 'react'
import { useState } from 'react'
import ActionIconBox from './ActionIconBox'
import ActionNameSpan from './ActionNameSpan'
import { toast } from 'react-toastify'
import { tweetShare } from '../../../../utils/twitter'
import { SHARE_EVENT_TWEET_CONTENTS } from '../../../../constants'
import { useWlUserReact } from '../../../../../../../libs/wl-user-react/core/src'

export type ActionInvitePeopleProps = {
  data: TaskActionItemDataType
  allowHandle?: boolean
  onCopy?: (text: string) => void
  copyBgc?: string
}

const ActionInvitePeople: React.FC<ActionInvitePeopleProps> = ({
  data,
  allowHandle,
  onCopy,
  copyBgc,
}: ActionInvitePeopleProps) => {
  const { user } = useWlUserReact()
  const { name, progress, orderNum, type, taskId, projectId, communityId, description, data: actionData, status } = data
  const [refUrl, setRefUrl] = useState('')

  useEffect(() => {
    if (user.id > 0) {
      const url = getTakeTaskRefLink(user.id, taskId)
      setRefUrl(url)
    }
  }, [user])

  const isDone = status === UserActionStatus.DONE
  const handleCopySuccess = () => {
    toast.success('Copied!')
    if (onCopy) {
      onCopy(refUrl)
    }
  }
  return (
    <ActionInvitePeopleWrapper>
      <ActionIconBox allowHandle={allowHandle} isDone={isDone}>
        <TooltipWrapper title={description}>
          <IconWL opacity={isDone ? 0.5 : 1} />
        </TooltipWrapper>
      </ActionIconBox>
      <ActionContentBox>
        <ActionNameSpan allowHandle={allowHandle} isDone={isDone}>
          {name} {progress && progress != '' && <ProgressSpan>({progress})</ProgressSpan>}
        </ActionNameSpan>

        {allowHandle && (
          <ActionInviteCopyBox bgc={copyBgc}>
            <InviteLinkBox onClick={() => tweetShare(SHARE_EVENT_TWEET_CONTENTS, refUrl)}>{refUrl}</InviteLinkBox>
            <CopyToClipboard text={refUrl} onCopy={handleCopySuccess}>
              <CopyBtn>
                <IconCopy opacity={isDone ? 0.5 : 1} size="1.2rem" />
              </CopyBtn>
            </CopyToClipboard>
          </ActionInviteCopyBox>
        )}
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
const ActionContentBox = styled.div`
  flex: 1;
`
const ProgressSpan = styled.span`
  color: rgba(51, 51, 51, 0.5);
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
