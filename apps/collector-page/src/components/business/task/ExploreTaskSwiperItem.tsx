/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 18:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 10:24:56
 * @Description: file description
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MEDIA_BREAK_POINTS, MOBILE_BREAK_POINT } from '../../../constants';
import { ScrollBarCss } from '../../../GlobalStyle';
import { RewardData, RewardType } from '../../../types/entities';
import {
  getTaskRewardTypeLabel,
  getTaskRewardTypeValue,
  isNoEndTime,
} from '../../../utils/task';
import PngIconAlarmClock from '../../common/icons/PngIconAlarmClock';
import PngIconGiftBox from '../../common/icons/PngIconGiftBox';
import PngIconScissorHand from '../../common/icons/PngIconScissorHand';
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox';
import RichTextToPlainTextSpan from '../../common/text/RichTextToPlainTextSpan';
import TaskImageDefault from './TaskImageDefault';

export type ExploreTaskSwiperItemDataType = {
  id: number;
  name: string;
  image: string;
  startTime: number;
  endTime: number;
  description: string;
  winnerNum?: number;
  project?: {
    slug: string;
    chainId: number;
    name: string;
  };
  reward?: {
    name: string;
    type: RewardType;
    raffled: boolean;
    data: RewardData;
  };
};
export type ExploreTaskSwiperItemViewConfigType = {};

export type ExploreTaskSwiperItemDataViewType = {
  data: ExploreTaskSwiperItemDataType;
  viewConfig?: ExploreTaskSwiperItemViewConfigType;
};
export type ExploreTaskSwiperItemHandlesType = {};

export type ExploreTaskSwiperItemProps = ExploreTaskSwiperItemDataViewType &
  ExploreTaskSwiperItemHandlesType;

const ExploreTaskSwiperItem: React.FC<ExploreTaskSwiperItemProps> = ({
  data,
  viewConfig,
}: ExploreTaskSwiperItemProps) => {
  const navigate = useNavigate();
  const {
    id,
    name,
    image,
    startTime,
    endTime,
    winnerNum,
    description,
    project,
    reward,
  } = data;
  const rewardTypeLabel = getTaskRewardTypeLabel(reward);
  const startDate = new Date(startTime).toLocaleDateString();
  const rewardValue = getTaskRewardTypeValue(reward);
  return (
    <ExploreTaskSwiperItemWrapper
      onClick={() => navigate(`/${project?.slug}/${id}`)}
    >
      {/* <ChainTag size={2} chainId={project.chainId} /> */}
      <TaskImageBox>
        <TaskImage src={image} />
      </TaskImageBox>

      <TaskInfoBox>
        <TaskInfoTopBox>
          <TaskName>{name}</TaskName>
          <ProjectName>
            Project: {project?.name || 'Unknown Project'}
          </ProjectName>
        </TaskInfoTopBox>
        <TaskInfoBottomBox>
          <TaskTypeLabel>{rewardTypeLabel}</TaskTypeLabel>
          <TaskDateAndWinnerBox>
            <TaskDateAndWinnerItem>
              <PngIconAlarmClock size="16px" />
              <TaskDateTime>
                {startDate}
                {!isNoEndTime(endTime) &&
                  ` — ${new Date(endTime).toLocaleDateString()}`}
              </TaskDateTime>
            </TaskDateAndWinnerItem>
            {winnerNum !== undefined && (
              <TaskDateAndWinnerItem>
                <PngIconScissorHand size="16px" />
                <TaskWinners>Winners : {winnerNum}</TaskWinners>
              </TaskDateAndWinnerItem>
            )}
          </TaskDateAndWinnerBox>
          {reward && (
            <TaskRewardBox>
              <PngIconGiftBox size="18px" />
              <TaskReward>Reward : {rewardValue}</TaskReward>
            </TaskRewardBox>
          )}
          <TaskDescription>
            <RichTextToPlainTextSpan value={description} />
          </TaskDescription>
        </TaskInfoBottomBox>
      </TaskInfoBox>
    </ExploreTaskSwiperItemWrapper>
  );
};
export default ExploreTaskSwiperItem;
const ExploreTaskSwiperItemWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  cursor: pointer;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
  }
`;
const TaskImageBox = styled.div`
  width: 50%;
  height: 100%;
  overflow: hidden;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
    height: 158px;
  }
`;
const TaskImage = styled(TaskImageDefault)`
  width: 100%;
  height: 100%;
  cursor: pointer;
  /* 图片不失真 ,保持其宽高比, 多余的会被剪切*/
  object-fit: cover;
  /* 鼠标移入时, 放大图片10%, 0.5s完成 */
  &:hover {
    transform: scale(1.1);
  }
  /** 鼠标点下，下沉2px */
  &:active {
    transform: translateY(2px);
  }
  transition: all 0.5s ease-out;
`;
const TaskInfoBox = styled.div`
  width: 50%;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    width: 100%;
    padding: 20px;
  }
`;
const TaskInfoTopBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    gap: 0px;
  }
`;
const TaskName = styled(OverflowEllipsisBox)`
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 20px;
    line-height: 30px;
  }
`;
const ProjectName = styled.div`
  font-size: 18px;
  line-height: 27px;
  color: #3dd606;

  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 14px;
    line-height: 21px;
  }
`;

const TaskInfoBottomBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  box-sizing: border-box;
`;

const TaskTypeLabel = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;

  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 14px;
    line-height: 21px;
  }
`;
const TaskDateAndWinnerBox = styled.div`
  display: flex;
  gap: 20px;
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    font-size: 12px;
    line-height: 18px;
  }
`;
const TaskDateAndWinnerItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  gap: 4px;

  background: #d3ed85;
  border-radius: 20px;
`;
const TaskDateTime = styled.span``;
const TaskWinners = styled.span``;
const TaskRewardBox = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;
const TaskReward = styled(OverflowEllipsisBox)`
  flex: 1;
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
    line-height: 18px;
  }
`;
const TaskDescription = styled(OverflowEllipsisBox)`
  font-size: 14px;
  line-height: 21px;
  color: rgba(51, 51, 51, 0.6);

  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    font-size: 12px;
    line-height: 18px;
  }
`;
