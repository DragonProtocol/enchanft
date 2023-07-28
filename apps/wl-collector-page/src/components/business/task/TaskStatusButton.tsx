import React, { useCallback } from 'react';
import styled from 'styled-components';
import { MOBILE_BREAK_POINT } from '../../../constants';
import ButtonBase, { ButtonPrimary } from '../../common/button/ButtonBase';

// eslint-disable-next-line @typescript-eslint/ban-types
export type TaskStatusButtonDataType = {};

export enum TaskStatusButtonType {
  ACCOUNT_OPERATION = 'ACCOUNT_OPERATION',
  TAKE = 'TAKE',
  COMPLETE = 'COMPLETE',
  MISSION_OFF = 'MISSION_OFF',
}
const buttonTextMap = {
  [TaskStatusButtonType.ACCOUNT_OPERATION]: 'Apply For WL',
  [TaskStatusButtonType.TAKE]: 'Apply For WL',
  [TaskStatusButtonType.COMPLETE]: 'Outcome Pending',
  [TaskStatusButtonType.MISSION_OFF]: 'Mission off',
};
export type TaskStatusButtonDataViewType = {
  type: TaskStatusButtonType;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  btnText?: string;
};

export type TaskStatusButtonProps = TaskStatusButtonDataViewType & {
  onAccountOperation?: () => void;
  onTake?: () => void;
};

const TaskStatusButton: React.FC<TaskStatusButtonProps> = ({
  type,
  loading = false,
  loadingText = 'loading ...',
  disabled = false,
  btnText,
  onAccountOperation,
  onTake,
}: TaskStatusButtonProps) => {
  const btnTextStr = btnText || buttonTextMap[type];

  const handleAccountOperation = () => {
    if (onAccountOperation) {
      onAccountOperation();
    }
  };
  const handleTake = () => {
    if (onTake) {
      onTake();
    }
  };

  const renderStatusContent = () => {
    switch (type) {
      case TaskStatusButtonType.ACCOUNT_OPERATION:
        return (
          <TaskBtn onClick={handleAccountOperation} disabled={disabled}>
            {btnTextStr}
          </TaskBtn>
        );
      case TaskStatusButtonType.TAKE:
        return (
          <TaskBtn onClick={handleTake} disabled={disabled}>
            {loading ? loadingText : btnTextStr}
          </TaskBtn>
        );
      case TaskStatusButtonType.COMPLETE:
        return <TaskStatusDescBtn>{btnTextStr}</TaskStatusDescBtn>;
      case TaskStatusButtonType.MISSION_OFF:
        return <TaskBtn disabled>{btnTextStr}</TaskBtn>;
      default:
        return null;
    }
  };
  return (
    <TaskStatusButtonWrapper>{renderStatusContent()}</TaskStatusButtonWrapper>
  );
};
export default TaskStatusButton;
const TaskStatusButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TaskBtn = styled(ButtonPrimary)`
  width: 100%;
  font-weight: 700;
  font-size: 18px;
`;

const TaskStatusDescBtn = styled(ButtonBase)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 18px;
  box-sizing: border-box;
  gap: 10px;
  width: 100%;
  height: 48px;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  border-bottom: 1px solid #d9d9d9;
  color: #3dd606;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 16px;
    line-height: 24px;
  }
`;