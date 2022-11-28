/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-13 16:25:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-15 16:08:07
 * @Description: file description
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Project,
  Reward,
  RewardType,
  TaskTodoCompleteStatus,
  TaskType,
  Whitelist,
} from '../../../types/entities';
import { UserActionStatus } from '../../../types/api';
import ButtonBase from '../../common/button/ButtonBase';
import { TaskActionItemDataType } from './TaskActionItem';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import MoodIcon from '@mui/icons-material/Mood';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import TaskActionList, { TaskActionsListHandlesType } from './TaskActionList';
import { todoTaskCompleteStatusMap } from './TodoTaskList';
import { useNavigate } from 'react-router-dom';
import ProjectMintButton from '../project/ProjectMintButton';
import PngIconGiftBox from '../../common/icons/PngIconGiftBox';
import { isNoEndTime } from '../../../utils/task';

export type TodoTaskItemDataType = {
  id: number;
  name: string;
  image: string;
  whitelistTotalNum: number;
  type: TaskType;
  projectId: number;
  startTime: number;
  endTime: number;
  description: string;
  status?: TaskTodoCompleteStatus;
  actions?: TaskActionItemDataType[];
  project?: Project;
  whitelist?: Whitelist;
  reward?: Reward;
};

export type TodoTaskItemViewConfigType = {
  displayMint?: boolean;
  disabledMint?: boolean;
  loadingMint?: boolean;
  allowOpenActions?: boolean;
  openActions?: boolean;
  allowHandleActions?: boolean;
  displayRefresh?: boolean;
  disabledRefresh?: boolean;
  loadingRefresh?: boolean;
  loadingRefreshMsg?: string;
  verifyingActions?: number[];
  allowNavigateToTask?: boolean;
  displayReward?: boolean;
};

export type TodoTaskItemDataViewType = {
  data: TodoTaskItemDataType;
  viewConfig?: TodoTaskItemViewConfigType;
};

export type TodoTaskItemHandlesType = TaskActionsListHandlesType & {
  onMint?: (task: TodoTaskItemDataType) => void;
  onVerifyTask?: (task: TodoTaskItemDataType) => void;
};

export type TodoTaskItemProps = TodoTaskItemDataViewType &
  TodoTaskItemHandlesType;

const defaultViewConfig: TodoTaskItemViewConfigType = {
  displayMint: false,
  disabledMint: false,
  loadingMint: false,
  allowOpenActions: false,
  openActions: false,
  allowHandleActions: false,
  displayRefresh: false,
  disabledRefresh: false,
  loadingRefresh: false,
  loadingRefreshMsg: 'refreshing...',
  verifyingActions: [],
  allowNavigateToTask: false,
  displayReward: false,
};
const TaskTodoCompleteStatusView = {
  [TaskTodoCompleteStatus.COMPLETED]: {
    icon: '👍',
    text: 'Completed!',
  },
  [TaskTodoCompleteStatus.WON]: {
    icon: '🎉',
    text: 'Congratulations!',
  },
  [TaskTodoCompleteStatus.LOST]: {
    icon: '💔',
    text: 'Sorry',
  },
  [TaskTodoCompleteStatus.CLOSED]: {
    icon: '🙁',
    text: 'Sorry',
  },
};

const TodoTaskItem: React.FC<TodoTaskItemProps> = ({
  data,
  viewConfig,
  onMint,
  onVerifyTask,
  ...taskActionItemStaticProps
}: TodoTaskItemProps) => {
  const navginate = useNavigate();
  const {
    id,
    name,
    whitelistTotalNum,
    type,
    projectId,
    startTime,
    endTime,
    actions,
    status,
    project,
    whitelist,
    reward,
  } = data;
  const {
    disabledMint,
    displayMint,
    loadingMint,
    allowOpenActions,
    openActions,
    allowHandleActions,
    displayRefresh,
    disabledRefresh,
    loadingRefresh,
    loadingRefreshMsg,
    verifyingActions,
    allowNavigateToTask,
    displayReward,
  } = {
    ...defaultViewConfig,
    ...viewConfig,
  };

  // 根据任务完成状态视图
  const renderTaskStatusContent = () => {
    switch (status) {
      case TaskTodoCompleteStatus.TODO:
      case TaskTodoCompleteStatus.IN_PRGRESS:
        // 计算所有action，和已完成的action数量
        const allActionNum = actions?.length || 0;
        const actionDoneNum = (actions || []).filter(
          (action) => action.status === UserActionStatus.DONE
        ).length;
        return (
          <TaskProgressBox>
            {!isNoEndTime(endTime) && (
              <ExcessTime>
                {Math.ceil((endTime - Date.now()) / (1000 * 60 * 60 * 24))} days
                left
              </ExcessTime>
            )}
            <CompleteNum>
              {loadingRefresh
                ? 'Loading...'
                : `(${actionDoneNum}/${allActionNum})`}
            </CompleteNum>
          </TaskProgressBox>
        );
      case TaskTodoCompleteStatus.COMPLETED:
      case TaskTodoCompleteStatus.WON:
      case TaskTodoCompleteStatus.LOST:
      case TaskTodoCompleteStatus.CLOSED:
        return (
          <Status>
            <StatusIcon>{TaskTodoCompleteStatusView[status].icon}</StatusIcon>
            <StatusText>{TaskTodoCompleteStatusView[status].text}</StatusText>
          </Status>
        );
      default:
        return null;
    }
  };
  // mint按钮点击事件
  const onMintClick = () => {
    // if (onMint) {
    //   onMint(data)
    // }
    window.open(project?.mintUrl, '_blank', 'noopener,noreferrer');
  };

  // 是否展开action
  const isOpenActionsDefault = allowOpenActions && openActions ? true : false;
  const [isOpenActions, setIsOpenActions] = useState(isOpenActionsDefault);
  const onTaskClick = () => {
    if (allowOpenActions) {
      setIsOpenActions(!isOpenActions);
    } else if (allowNavigateToTask) {
      navginate(`/${project?.slug}/${id}`);
    }
  };
  const onVerifyTaskClick = () => {
    if (onVerifyTask) {
      onVerifyTask(data);
    }
  };
  const renderRewardContent = useCallback(() => {
    if (reward) {
      switch (reward.type) {
        case RewardType.WHITELIST:
          if (!project?.mintUrl || !whitelist) return null;
          return (
            <ProjectMintButton
              startTimestamp={whitelist.mintStartTime}
              onClick={onMintClick}
              disabled={disabledMint}
            />
          );
        case RewardType.CONTRIBUTION_TOKEN:
          return (
            <RewardTextBox>
              <PngIconGiftBox size="16px" />
              <RewardText>
                You got <RewardTextBold>{reward.data.token_num}</RewardTextBold>{' '}
                contribution scores of{' '}
                <RewardProjectTextBtn
                  onClick={() => project?.slug && navginate(`/${project.slug}`)}
                >
                  {project?.name || 'Unknown Project'}
                </RewardProjectTextBtn>
              </RewardText>
            </RewardTextBox>
          );
        case RewardType.OTHERS:
          return (
            <RewardTextBox>
              <PngIconGiftBox size="16px" />
              <RewardText>
                You got <RewardTextBold>{reward.name}</RewardTextBold> form{' '}
                <RewardProjectTextBtn
                  onClick={() => project?.slug && navginate(`/${project.slug}`)}
                >
                  {project?.name || 'Unknown Project'}
                </RewardProjectTextBtn>
                . The team will contact you later
              </RewardText>
            </RewardTextBox>
          );
        default:
          return 'Unknown reward';
      }
    } else {
      return 'Unknown reward';
    }
  }, [reward, startTime, project]);
  return (
    <TodoTaskItemWrapper>
      <TaskBasicInfoBox
        isAllowClick={allowOpenActions || allowNavigateToTask}
        onClick={onTaskClick}
      >
        {project && <TaskBasicInfoLeftImg src={project.image} />}

        <TaskBasicInfoRightBox>
          <TaskName>{name}</TaskName>
          {renderTaskStatusContent()}
        </TaskBasicInfoRightBox>
      </TaskBasicInfoBox>
      {displayReward && (
        <TaskOpenBodyBox>{renderRewardContent()}</TaskOpenBodyBox>
      )}
      {actions && isOpenActions && (
        <TaskOpenBodyBox>
          <TaskActionList
            items={actions}
            allowHandle={allowHandleActions}
            displayVerify={displayRefresh}
            loadingVerify={loadingRefresh}
            disabledVerify={disabledRefresh}
            onVerifyActions={onVerifyTaskClick}
            verifyingActions={verifyingActions}
            dispalyLuckyDrawWeight={reward.luckyDraw}
            {...taskActionItemStaticProps}
          ></TaskActionList>
        </TaskOpenBodyBox>
      )}
    </TodoTaskItemWrapper>
  );
};
export default TodoTaskItem;
const TodoTaskItemWrapper = styled.div`
  width: 100%;
  background: #f7f9f1;
  border: 2px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
`;
const TaskBasicInfoBox = styled.div<{ isAllowClick?: Boolean }>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  ${(props) => props.isAllowClick && `cursor: pointer;`}
`;
const TaskBasicInfoLeftImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
`;
const TaskBasicInfoRightBox = styled.div`
  flex: 1;
`;
const TaskName = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`;
const TaskProgressBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 10px;
  line-height: 15px;
  color: rgba(51, 51, 51, 0.6);
`;
const ExcessTime = styled.div``;
const CompleteNum = styled.div``;
const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  line-height: 15px;
  color: rgba(51, 51, 51, 0.6);
  margin-top: 5px;
`;
const StatusIcon = styled.div``;
const StatusText = styled.div``;
const RewardTextBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const RewardText = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: #333333;
`;
const RewardTextBold = styled.span`
  font-weight: 700;
`;
const RewardProjectTextBtn = styled.a`
  font-weight: 700;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const TaskOpenBodyBox = styled.div`
  border-top: 1px solid #d9d9d9;
  padding-top: 12px;
  margin-top: 10px;
`;
