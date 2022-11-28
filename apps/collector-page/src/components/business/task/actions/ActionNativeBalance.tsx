/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-26 19:09:35
 * @Description: file description
 */
import React from 'react';
import styled, { css } from 'styled-components';
import { UserActionStatus } from '../../../../types/api';
import { TaskActionItemDataType } from '../TaskActionItem';
import TooltipWrapper from '../../../common/tooltip/TooltipWrapper';
import IconWL from '../../../common/icons/IconWL';
import ActionNameSpan from './ActionNameSpan';
import ActionIconBox from './ActionIconBox';
import { Chain } from 'apps/collector-page/src/types/entities';
export type ActionNativeBalanceProps = {
  data: TaskActionItemDataType;
  allowHandle?: boolean;
  onWallet?: (chain: Chain, callback: () => void) => void;
};

const ActionNativeBalance: React.FC<ActionNativeBalanceProps> = ({
  data,
  allowHandle,
  onWallet,
}: ActionNativeBalanceProps) => {
  const {
    name,
    orderNum,
    type,
    taskId,
    projectId,
    communityId,
    description,
    data: actionData,
    status,
    project,
  } = data;
  const isDone = status === UserActionStatus.DONE ? true : false;
  const handleAction = () => {
    if (!actionData.wallet_url) return;
    window.open(actionData.wallet_url, '_blank');
  };
  const clickAction = () => {
    if (!allowHandle || isDone || !actionData.chain) return;
    onWallet && onWallet(actionData.chain, handleAction);
  };
  return (
    <ActionNativeBalanceWrapper>
      <ActionNativeBalanceRow>
        <ActionIconBox
          allowHandle={allowHandle}
          isDone={isDone}
          onClick={clickAction}
        >
          <TooltipWrapper title={description}>
            <IconWL opacity={isDone ? 0.5 : 1} />
          </TooltipWrapper>
        </ActionIconBox>
        <ActionContentBox onClick={clickAction}>
          <ActionNameSpan allowHandle={allowHandle} isDone={isDone}>
            {name}
          </ActionNameSpan>
        </ActionContentBox>
      </ActionNativeBalanceRow>
    </ActionNativeBalanceWrapper>
  );
};
export default ActionNativeBalance;
const ActionNativeBalanceWrapper = styled.div`
  width: 100%;
`;
const ActionNativeBalanceRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;
const ActionContentBox = styled.div`
  flex: 1;
`;
