/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-01 18:05:02
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
export type ActionCustomProps = {
  data: TaskActionItemDataType;
  allowHandle?: boolean;
  onCustomAction?: (action: TaskActionItemDataType) => void;
};

const ActionCustom: React.FC<ActionCustomProps> = ({
  data,
  allowHandle,
  onCustomAction,
}: ActionCustomProps) => {
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
    if (!allowHandle || isDone) return;
    window.open(actionData.url, '_blank');
    if (onCustomAction) {
      onCustomAction(data);
    }
  };
  return (
    <ActionCustomWrapper>
      <ActionCustomRow>
        <ActionIconBox
          allowHandle={allowHandle}
          isDone={isDone}
          onClick={handleAction}
        >
          <TooltipWrapper title={description}>
            <IconWL opacity={isDone ? 0.5 : 1} />
          </TooltipWrapper>
        </ActionIconBox>
        <ActionContentBox onClick={handleAction}>
          <ActionNameSpan allowHandle={allowHandle} isDone={isDone}>
            {name}
          </ActionNameSpan>
        </ActionContentBox>
      </ActionCustomRow>
    </ActionCustomWrapper>
  );
};
export default ActionCustom;
const ActionCustomWrapper = styled.div`
  width: 100%;
`;
const ActionCustomRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;
const ActionContentBox = styled.div`
  flex: 1;
`;
