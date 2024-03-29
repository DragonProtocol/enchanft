import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useCallback, useEffect } from 'react';
import Dashboard from '../Components/TaskDashboard/Dashboard';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  getCreatorDashboardData,
  getWorkProofsData,
  saveWinnersData,
  selectCreator,
  submitReviewWorkProof,
} from '../redux/creatorDashboard';
import { useAppConfig } from '../AppProvider';
import Summary from '../Components/TaskDashboard/Summary';
import Schedule from '../Components/TaskDashboard/Schedule';
import {
  AsyncRequestStatus,
  downloadWinner,
  PassFlag,
  ReviewWorkProofParam,
} from '../api';
import { Loading } from '../Components/Loading';
import WinnerList from '../Components/TaskDashboard/WinnerList';
import WorkProof from '../Components/TaskDashboard/WorkProof';

export function TaskDashboard() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { account, isCreator, validLogin } = useAppConfig();
  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(selectCreator);
  const {
    status,
    participants,
    winners,
    whitelistSaved,
    winnerList,
    candidateList,
    participantList,
    taskInfo,
    scheduleInfo,
    pickedWhiteList,
    reward,
    workProofs,
  } = dashboardData;

  const downloadWinners = useCallback(
    (type: string) => {
      if (!taskId || !account.info) return;
      downloadWinner(type, taskId, account.info.token);
    },
    [taskId, account.info]
  );

  const saveWinners = useCallback(
    (list: Array<number>) => {
      if (!account.info?.token || !isCreator || !validLogin) return;
      dispatch(
        saveWinnersData({
          taskId: Number(taskId),
          winners: list,
          token: account.info.token,
        })
      );
    },
    [account.info?.token, isCreator, validLogin, dispatch, taskId]
  );

  const submitReview = useCallback(
    (data: ReviewWorkProofParam) => {
      if (!account.info?.token || !isCreator || !validLogin) return;
      //这里应该使用 workProofsStatus 做一个UI状态管理，
      dispatch(
        submitReviewWorkProof({
          taskId: Number(taskId),
          data: data,
          token: account.info?.token,
        })
      );
    },
    [account.info?.token, isCreator, validLogin, dispatch, taskId]
  );

  useEffect(() => {
    if (!account.info?.token || !isCreator || !validLogin) return;
    dispatch(
      getCreatorDashboardData({
        taskId: Number(taskId),
        token: account.info.token,
      })
    );
    // dispatch(
    //   getWorkProofsData({
    //     taskId: Number(taskId),
    //     token: account.info.token,
    //     passFlag: PassFlag.NOT_PROCESSED,
    //   })
    // );
  }, [taskId, account.info?.token, dispatch, isCreator, validLogin]);

  if (status === AsyncRequestStatus.REJECTED) {
    return <div>server error, please wait a minute.</div>;
  }

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
        <WinnerList
          reward={reward}
          winnerNum={taskInfo?.winnerNum || 0}
          whitelistSaved={whitelistSaved}
          winnerList={winnerList}
          candidateList={candidateList}
          participantList={participantList}
          pickedWhiteList={pickedWhiteList}
          schedules={scheduleInfo}
          uploadSelected={(ids: Array<number>) => {
            saveWinners(ids);
          }}
          downloadWinners={downloadWinners}
        />
      </div>
      <div className="right-box">
        <Summary info={taskInfo} reward={reward} />
        <Schedule schedules={scheduleInfo} reward={reward} />
        {taskId && account && account.info && account.info.token && (
          <WorkProof
            workProofs={workProofs}
            submitReview={(data) => {
              submitReview(data);
            }}
            viewAllWorkProofs={() => {
              navigate(`workProofs`);
            }}
          />
        )}
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
