/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-27 14:41:41
 * @Description: file description
 */
import React from 'react'
import styled, { css } from 'styled-components'
import { UserActionStatus } from '../../../../types/api'
import { TaskActionItemDataType } from '../TaskActionItem'
import TooltipWrapper from '../../../common/tooltip/TooltipWrapper'
import IconWL from '../../../common/icons/IconWL'
import ActionNameSpan from './ActionNameSpan'
import ActionIconBox from './ActionIconBox'
export type ActionNativeBalanceProps = {
  data: TaskActionItemDataType
  allowHandle?: boolean
  onCustomAction?: (action: TaskActionItemDataType) => void
}

const ActionNativeBalance: React.FC<ActionNativeBalanceProps> = ({
  data,
  allowHandle,
  onCustomAction,
}: ActionNativeBalanceProps) => {
  const { name, orderNum, type, taskId, projectId, communityId, description, data: actionData, status, project } = data
  const isDone = status === UserActionStatus.DONE ? true : false
  const handleAction = () => {
    if (!allowHandle || isDone || !actionData.wallet_url) return
    window.open(actionData.wallet_url, '_blank')
    if (onCustomAction) {
      onCustomAction(data)
    }
  }
  return (
    <ActionNativeBalanceWrapper>
      <ActionNativeBalanceRow>
        <ActionIconBox allowHandle={allowHandle} isDone={isDone} onClick={handleAction}>
          <TooltipWrapper title={description}>
            <IconWL opacity={isDone ? 0.5 : 1} />
          </TooltipWrapper>
        </ActionIconBox>
        <ActionContentBox onClick={handleAction}>
          <ActionNameSpan allowHandle={allowHandle} isDone={isDone}>
            {name}
          </ActionNameSpan>
        </ActionContentBox>
      </ActionNativeBalanceRow>
    </ActionNativeBalanceWrapper>
  )
}
export default ActionNativeBalance
const ActionNativeBalanceWrapper = styled.div`
  width: 100%;
`
const ActionNativeBalanceRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`
const ActionContentBox = styled.div`
  flex: 1;
`
