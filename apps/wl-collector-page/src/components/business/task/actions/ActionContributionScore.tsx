/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 10:55:17
 * @Description: file description
 */
import React from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserActionStatus } from '../../../../types/api';
import type { TaskActionItemDataType } from '../TaskActionItem';
import TooltipWrapper from '../../../common/tooltip/TooltipWrapper';
import IconWL from '../../../common/icons/IconWL';
import ActionNameSpan from './ActionNameSpan';
import ActionIconBox from './ActionIconBox';

export type ActionContributionScoreProps = {
  data: TaskActionItemDataType;
  allowHandle?: boolean;
};

const ActionContributionScore: React.FC<ActionContributionScoreProps> = ({
  data,
  allowHandle,
}: ActionContributionScoreProps) => {
  const navigate = useNavigate();
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
  const isDone = status === UserActionStatus.DONE;
  const handleAction = () => {
    if (!project?.slug || !allowHandle || isDone) return;
    navigate(`/${project.slug}/rank`);
  };
  return (
    <ActionContributionScoreWrapper>
      <ActionContributionScoreRow>
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
      </ActionContributionScoreRow>
    </ActionContributionScoreWrapper>
  );
};
export default ActionContributionScore;
const ActionContributionScoreWrapper = styled.div`
  width: 100%;
`;
const ActionContributionScoreRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;
const ActionContentBox = styled.div`
  flex: 1;
`;
