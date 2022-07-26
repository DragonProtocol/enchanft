/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-25 18:32:51
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import TipIcon from './icons/tip.svg'
import TooltipWrapper from '../../../common/TooltipWrapper'

export type ActionContributionScoreProps = {
  data: TaskActionItemDataType
}

const ActionContributionScore: React.FC<ActionContributionScoreProps> = ({ data }: ActionContributionScoreProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, description, data: actionData, status } = data
  return (
    <ActionContributionScoreWrapper>
      <ActionContributionScoreRow>
        <ActionContributionScoreLeft isDone={status === UserActionStatus.DONE}>{name}</ActionContributionScoreLeft>
        {status !== UserActionStatus.DONE && (
          <TooltipWrapper title={description}>
            <ActionContributionScoreIconBtn src={TipIcon}></ActionContributionScoreIconBtn>
          </TooltipWrapper>
        )}
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
const ActionContributionScoreLeft = styled.div<{ isDone?: Boolean }>`
  flex: 1;
  ${({ isDone }) => isDone && `text-decoration: line-through;`}
`
const ActionContributionScoreIconBtn = styled.img`
  cursor: pointer;
`
