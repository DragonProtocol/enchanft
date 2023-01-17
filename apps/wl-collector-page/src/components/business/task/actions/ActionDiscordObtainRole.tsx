/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 10:58:31
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import { UserActionStatus } from '../../../../types/api';
import type { TaskActionItemDataType } from '../TaskActionItem';
import IconDiscord from '../../../common/icons/IconDiscord';
import ActionIconBox from './ActionIconBox';
import ActionNameSpan from './ActionNameSpan';
import TooltipWrapper from '../../../common/tooltip/TooltipWrapper';

export type ActionDiscordObtainRoleProps = {
  data: TaskActionItemDataType;
  allowHandle?: boolean;
  onDiscord?: (callback: () => void) => void;
};

const ActionDiscordObtainRole: React.FC<ActionDiscordObtainRoleProps> = ({
  data,
  allowHandle,
  onDiscord,
}: ActionDiscordObtainRoleProps) => {
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
  } = data;
  const isDone = status === UserActionStatus.DONE;
  const handleAction = () => {
    const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=1000,height=1000,left=0,top=0`;
    window.open(actionData.url, name, winParams);
  };
  const clickAction = () => {
    if (!allowHandle || isDone) return;
    if (onDiscord) onDiscord(handleAction);
  };
  return (
    <ActionDiscordObtainRoleWrapper>
      <ActionIconBox allowHandle={allowHandle} isDone={isDone}>
        <TooltipWrapper title={description}>
          <IconDiscord opacity={isDone ? 0.5 : 1} />
        </TooltipWrapper>
      </ActionIconBox>
      <ActionContentBox onClick={clickAction}>
        <ActionNameSpan allowHandle={allowHandle} isDone={isDone}>
          Get 【{actionData?.role || ''}】 Role on Discord
        </ActionNameSpan>
      </ActionContentBox>
    </ActionDiscordObtainRoleWrapper>
  );
};
export default ActionDiscordObtainRole;
const ActionDiscordObtainRoleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;
const ActionContentBox = styled.div`
  flex: 1;
`;
