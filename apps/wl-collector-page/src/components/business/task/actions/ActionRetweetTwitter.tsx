/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-14 14:09:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 11:11:51
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import { UserActionStatus } from '../../../../types/api';
import type { TaskActionItemDataType } from '../TaskActionItem';
import IconTwitter from '../../../common/icons/IconTwitter';
import ActionIconBox from './ActionIconBox';
import ActionNameSpan from './ActionNameSpan';
import { getTwitterRetweetLink } from '../../../../utils/twitter';

export type ActionRetweetTwitterProps = {
  data: TaskActionItemDataType;
  allowHandle?: boolean;
  onTwitter?: (callback: () => void) => void;
};

const ActionRetweetTwitter: React.FC<ActionRetweetTwitterProps> = ({
  data,
  allowHandle,
  onTwitter,
}: ActionRetweetTwitterProps) => {
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
    const url = getTwitterRetweetLink(actionData?.tweet_id || '');
    window.open(url, name, winParams);
  };
  const clickAction = () => {
    if (!allowHandle || isDone) return;
    if (onTwitter) onTwitter(handleAction);
  };
  return (
    <ActionRetweetTwitterWrapper>
      <ActionIconBox
        allowHandle={allowHandle}
        isDone={isDone}
        onClick={clickAction}
      >
        <IconTwitter opacity={isDone ? 0.5 : 1} />
      </ActionIconBox>
      <ActionContentBox onClick={clickAction}>
        <ActionNameSpan allowHandle={allowHandle} isDone={isDone}>
          {name}
        </ActionNameSpan>
      </ActionContentBox>
    </ActionRetweetTwitterWrapper>
  );
};
export default ActionRetweetTwitter;
const ActionRetweetTwitterWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;
const ActionContentBox = styled.div`
  flex: 1;
`;
