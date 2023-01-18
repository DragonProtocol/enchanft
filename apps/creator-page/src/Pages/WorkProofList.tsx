import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from '../redux/store';
import { PassFlag, ReviewWorkProofParam } from '../api';
import { useAppConfig } from '../AppProvider';
import {
  getWorkProofsData,
  selectCreator,
  submitReviewWorkProof,
  WorkProofInfo,
} from '../redux/creatorDashboard';
import { ActionType } from '../Components/TaskCreate/type';
import PassModal from '../Components/TaskDashboard/PassModal';
import PngIconCaretLeft from '../Components/Icons/PngIconCaretLeft';

type Tab = 'Pending' | 'Pass' | 'No Pass';

export function WorkProofList() {
  const { account, isCreator, validLogin } = useAppConfig();
  const { slug, taskId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('Pending');

  const [passModalData, setPassModalData] = useState<WorkProofInfo | undefined>(
    undefined
  );

  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(selectCreator);
  const { allWorkProofs } = dashboardData;

  useEffect(() => {
    if (!account.info?.token || !isCreator || !validLogin) return;
    const passFlag =
      tab === 'Pending'
        ? PassFlag.NOT_PROCESSED
        : tab === 'Pass'
        ? PassFlag.PASS
        : tab === 'No Pass'
        ? PassFlag.NOPASS
        : PassFlag.ALL;
    dispatch(
      getWorkProofsData({
        taskId: Number(taskId),
        passFlag: passFlag,
        token: account.info.token,
      })
    );
  }, [taskId, account.info?.token, dispatch, isCreator, validLogin, tab]);

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

  return (
    <ContentBox>
      <div className="header">
        <button
          title="back"
          onClick={() => {
            navigate(-1);
          }}
        >
          <PngIconCaretLeft />
        </button>
        <h2>Work Proof</h2>
      </div>
      <div className="tab-header">
        <div className="tab">
          {['Pending', 'Pass', 'No Pass'].map((item, idx) => {
            return (
              <span
                key={item}
                className={tab === item ? 'active' : ''}
                onClick={() => setTab(item as Tab)}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>
      <div className="table">
        <div className="title item">
          <span>User Name</span>
          <span>Work Proof</span>
          <span>Time</span>
          <span>Action</span>
        </div>
        {allWorkProofs.map((item, idx) => {
          return (
            <div key={idx} className="content item">
              <span>{item.userName}</span>
              {item.actionType === ActionType.QUESTIONNAIRE && (
                <span>
                  Q: {item.actionData.question}
                  <br />
                  A: {item.actionData.answer}
                </span>
              )}
              {item.actionType === ActionType.UPLOAD_IMAGE && (
                <span>
                  Q: {item.actionData.question}
                  <br />
                  <img
                    src={item.actionData.answer}
                    alt={item.actionData.question}
                  ></img>
                </span>
              )}
              <span>{dayjs(item.submitTime).format('YYYY/MM/DD HH:mm')}</span>
              {(item.passed === null && (
                <span className="btns">
                  <button
                    className="nopass"
                    onClick={() => setPassModalData(item)}
                  >
                    No Pass
                  </button>
                  <button
                    className="pass"
                    onClick={() =>
                      submitReview({
                        userId: item.userId,
                        actionId: item.actionId,
                        passed: true,
                        nopassReason: '',
                      })
                    }
                  >
                    Pass
                  </button>
                </span>
              )) || <span />}
            </div>
          );
        })}
      </div>
      <PassModal
        nopassMode={true}
        data={passModalData}
        closeModal={() => {
          setPassModalData(undefined);
        }}
        submit={(passed: boolean, feedback: string) => {
          if (passModalData) {
            const result: ReviewWorkProofParam = {
              userId: passModalData.userId,
              actionId: passModalData.actionId,
              passed: passed,
              nopassReason: feedback,
            };
            submitReview(result);
            setPassModalData(undefined);
          }
        }}
      />
    </ContentBox>
  );
}

const ContentBox = styled.div`
  padding: 40px;
  background: #f7f9f1;
  border: 4px solid #333333;
  & .header {
    display: flex;
    gap: 20px;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #d9d9d9;
    > button {
      width: 48px;
      height: 48px;
      background: #e4ffdb;
      border: 2px solid #333333;
      box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
      border-radius: 20px;
      & img {
        vertical-align: middle;
        height: 18px;
        width: 12px;
      }
    }
    & h2 {
      font-weight: 700;
      font-size: 36px;
      color: #333333;
      padding: 0;
      margin: 0;
    }
  }
  & .tab-header {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    & .tab {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      width: 400px;
      height: 48px;

      border: 2px solid #333333;
      border-radius: 10px;
      overflow: hidden;

      & span {
        display: inline-block;
        border-left: 2px solid #333333;
        text-align: center;
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        color: #333333;
        padding-top: 10px;
        cursor: pointer;
        &:first-child {
          border: none;
        }
        &.active {
          color: #ffffff;
          background: #333333;
        }
      }
    }

    & button {
      width: 180px;
      height: 48px;

      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #ffffff;
    }
  }

  & .table {
    margin-top: 20px;
    padding: 5px 20px;
    gap: 20px;

    background: #ebeee4;
    border-radius: 10px;

    & .item {
      display: flex;
      gap: 50px;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;

      border-top: 1px solid #d9d9d9;

      min-width: 200px;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      color: #333333;

      & a {
        text-decoration: none;
        color: inherit;
      }

      & img {
        max-width: 200px;
        max-height: 100px;
      }

      &:first-child {
        border: none;
      }

      &.title {
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: rgba(51, 51, 51, 0.6);
      }
      &.content {
        & span {
          &:first-child {
            font-weight: 700;
          }
        }
      }
      & span {
        width: 200px;
        word-break: break-word;
        &:nth-child(2) {
          width: 300px;
        }
        &:last-child {
          width: 210px;
        }
      }
    }

    & .btns {
      display: flex;
      & button {
        cursor: pointer;
        padding: 0px 20px;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;

        border: none;
        height: 48px;
        font-size: 16px;
        box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }

      & button.pass {
        background-color: #3dd606;
        color: #fff;
        margin-left: 20px;
      }
      & button.nopass {
        background-color: #ff2222;

        color: #fff;
      }
    }
  }
`;