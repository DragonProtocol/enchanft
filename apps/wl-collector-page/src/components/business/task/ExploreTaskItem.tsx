/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-07 11:52:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 10:23:40
 * @Description: file description
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MOBILE_BREAK_POINT } from '../../../constants';
import { ScrollBarCss } from '../../../GlobalStyle';
import {
  RewardData,
  RewardType,
  TaskTodoCompleteStatus,
} from '../../../types/entities';
import { getTaskRewardTypeValue, isNoEndTime } from '../../../utils/task';
import { formatDateTime } from '../../../utils/time';
import CardItemBox, {
  CardItemBoxAnimationType,
} from '../../common/card/CardItemBox';
import PngIconAlarmClock from '../../common/icons/PngIconAlarmClock';
import PngIconGiftBox from '../../common/icons/PngIconGiftBox';
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox';
import ChainTag from '../chain/ChainTag';
import TaskImageDefault from './TaskImageDefault';

export type ExploreTaskItemDataType = {
  id: number;
  image: string;
  name: string;
  startTime: number;
  endTime: number;
  project?: {
    slug: string;
    chainId: number;
  };
  reward?: {
    name: string;
    type: RewardType;
    raffled: boolean;
    data: RewardData;
  };
  status?: TaskTodoCompleteStatus;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ExploreTaskItemViewConfigType = {};

export type ExploreTaskItemDataViewType = {
  data: ExploreTaskItemDataType;
  viewConfig?: ExploreTaskItemViewConfigType;
};

export type ExploreTaskItemProps = ExploreTaskItemDataViewType;

const defaultViewConfig = {};
const ExploreTaskItem: React.FC<ExploreTaskItemProps> = ({
  data,
  viewConfig,
}: ExploreTaskItemProps) => {
  const navigate = useNavigate();
  const { id, name, image, startTime, endTime, project, reward, status } = data;
  const startDate = formatDateTime(startTime);
  const rewardValue = getTaskRewardTypeValue(reward);
  const displayStatusTagAccepted =
    !!status &&
    [TaskTodoCompleteStatus.TODO, TaskTodoCompleteStatus.IN_PRGRESS].includes(
      status
    );
  const displayStatusTagComplete =
    !!status &&
    [
      TaskTodoCompleteStatus.COMPLETED,
      TaskTodoCompleteStatus.WON,
      TaskTodoCompleteStatus.LOST,
    ].includes(status);
  let statusTag = null;
  if (displayStatusTagAccepted) {
    statusTag = <TaskStatusTagAccepted>Accepted</TaskStatusTagAccepted>;
  } else if (displayStatusTagComplete) {
    statusTag = <TaskStatusTagComplete>Complete</TaskStatusTagComplete>;
  }
  return (
    <ExploreTaskItemWrapper
      onClick={() => navigate(`/${project?.slug}/${id}`)}
      animationType={CardItemBoxAnimationType.HOVER_MOVE_UP}
    >
      <TaskImageBox>
        {project?.chainId && <ChainTag size={1} chainId={project.chainId} />}
        <TaskImage src={image} />
      </TaskImageBox>
      <TaskInfoBox>
        <TaskName number={2}>
          {statusTag} {name}
        </TaskName>
        <TaskInfoBottom>
          <TaskInfoRow>
            <PngIconAlarmClock size="16px" />
            <TaskDateTime>
              {startDate}
              {!isNoEndTime(endTime) && ` — ${formatDateTime(endTime)}`}
            </TaskDateTime>
          </TaskInfoRow>
          {reward && (
            <TaskInfoRow>
              <PngIconGiftBox size="16px" />
              <TaskRemark>{rewardValue}</TaskRemark>
            </TaskInfoRow>
          )}
        </TaskInfoBottom>
      </TaskInfoBox>
    </ExploreTaskItemWrapper>
  );
};
export default ExploreTaskItem;
const ExploreTaskItemWrapper = styled(CardItemBox)`
  height: 275px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    height: 257px;
  }
`;
const TaskImageBox = styled.div`
  width: 100%;
  height: 130px;
  position: relative;
  flex-shrink: 0;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    height: 138px;
  }
`;
const TaskImage = styled(TaskImageDefault)`
  width: 100%;
  height: 100%;
  /* 图片不失真，不会出现拉伸 */
  object-fit: cover;
`;
const TaskInfoBox = styled.div`
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;
const TaskName = styled(OverflowEllipsisBox)`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
  flex-shrink: 0;
`;
const TaskInfoBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;
const TaskDateTime = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(51, 51, 51, 0.6);
`;
const TaskInfoRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;
const TaskRemark = styled(OverflowEllipsisBox)`
  flex: 1;
  font-size: 12px;
  line-height: 18px;
  color: #333333;
`;
const TaskStatusTag = styled.span`
  display: inline-block;
  font-weight: 700;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  border-radius: 4px;
  padding: 0px 4px;
  box-sizing: border-box;
  text-align: center;
  color: #ffffff;
  vertical-align: middle;
`;
const TaskStatusTagAccepted = styled(TaskStatusTag)`
  background: #333333;
`;
const TaskStatusTagComplete = styled(TaskStatusTag)`
  background: #3dd606;
`;