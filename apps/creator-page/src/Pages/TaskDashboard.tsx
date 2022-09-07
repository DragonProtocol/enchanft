import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import log from 'loglevel';

import { useEffect } from 'react';
import Dashboard from '../Components/TaskDashboard/Dashboard';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  getCreatorDashboardData,
  resetData,
  selectCreator,
} from '../redux/creatorDashboard';
import { useAppConfig } from '../AppProvider';
import Summary from '../Components/TaskDashboard/Summary';
import Schedule from '../Components/TaskDashboard/Schedule';
import { AsyncRequestStatus } from '../api';
import Loading from '../Components/Loading';

export function TaskDashboard() {
  const { taskId } = useParams();
  const { account, isCreator } = useAppConfig();
  const dispatch = useAppDispatch();
  const {
    status,
    participants,
    winners,
    whitelistSaved,
    winnerList,
    candidateList,
    taskInfo,
    scheduleInfo,
    pickedWhiteList,
    reward,
  } = useAppSelector(selectCreator);

  useEffect(() => {
    if (!account.info || !isCreator) return;
    dispatch(
      getCreatorDashboardData({
        taskId: Number(taskId),
        token: account.info.token,
      })
    );
  }, [taskId, account.info, dispatch, isCreator]);

  if (status !== AsyncRequestStatus.FULFILLED) {
    return (
      <DashboardBox>
        <div className="loading">
          <Loading />
        </div>
      </DashboardBox>
    );
  }

  return (
    <DashboardBox>
      <div className="left-box">
        <Dashboard
          participants={participants}
          winners={winners}
          completionRate={
            participants === 0
              ? '0.00'
              : ((winners * 100) / participants).toFixed(2)
          }
        />
        <div>WinnerList</div>
      </div>
      <div className="right-box">
        <Summary info={taskInfo} reward={reward} />
        <Schedule schedules={scheduleInfo} reward={reward} />
      </div>
    </DashboardBox>
  );
}

const DashboardBox = styled.div`
  display: flex;
  gap: 20px;
  > .loading {
    text-align: center;
    width: 100%;
    padding-top: 50px;
    & img {
      width: 100px;
    }
  }
  .left-box,
  .right-box {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .left-box {
    width: 760px;
  }
  .right-box {
    flex-grow: 1;
  }
  > div {
    > div {
      box-sizing: border-box;
      background: #f7f9f1;
      border: 4px solid #333333;
      border-radius: 20px;
      padding: 20px 24px;
    }
  }

  & h3 {
    margin: 0;
  }
`;
