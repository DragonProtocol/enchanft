/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 15:16:28
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import TooltipWrapper from '../../../common/TooltipWrapper'
import IconTip from '../../../common/icons/IconTip'
import { useNavigate } from 'react-router-dom'
import { CommunityParamsVisibleType } from '../../../../container/Community'
export type ActionContributionScoreProps = {
  data: TaskActionItemDataType
}

const ActionContributionScore: React.FC<ActionContributionScoreProps> = ({ data }: ActionContributionScoreProps) => {
  const navigate = useNavigate()
  const { name, orderNum, type, taskId, projectId, communityId, description, data: actionData, status } = data
  const isDone = status === UserActionStatus.DONE ? true : false
  const handleAction = () => {
    if (isDone) return
    navigate(`/community/${communityId}?visible=${CommunityParamsVisibleType.CONTRIBUTION}`)
  }
  return (
    <ActionContributionScoreWrapper>
      <ActionContributionScoreRow>
        <ActionLeft isDone={isDone} onClick={handleAction}>
          {name}
        </ActionLeft>
        <ActionRight isDone={isDone} onClick={handleAction}>
          <TooltipWrapper title={description}>
            <IconTip opacity={isDone ? 0.5 : 1} />
          </TooltipWrapper>
        </ActionRight>
      </ActionContributionScoreRow>
    </ActionContributionScoreWrapper>
  )
}
export default ActionContributionScore
const ActionContributionScoreWrapper = styled.div`
  width: 100%;
`
const ActionContributionScoreRow = styled.div`
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
