import { AxiosPromise } from 'axios';
import { useState } from 'react';
import styled from 'styled-components';
import { ReviewWorkProofParam } from '../../api';
import { WorkProofInfo } from '../../redux/creatorDashboard';
import { ActionTypeMore } from '../TaskCreate/type';
import PassModal from './PassModal';

export default function WorkProof({
  workProofs,
  submitReview,
  viewAllWorkProofs,
}: {
  workProofs: WorkProofInfo[];
  submitReview: (data: ReviewWorkProofParam) => void;
  viewAllWorkProofs: () => void;
}) {
  const [passModalData, setPassModalData] = useState<WorkProofInfo | undefined>(
    undefined
  );
  const dateNow = new Date();
  return workProofs ? (
    <>
      <WorkProofBox>
        <div className="header">
          <h3>Work Proof</h3>
          <button title="close" onClick={viewAllWorkProofs}>
            view all
          </button>
        </div>
        <WorkProofListBox>
          {workProofs.map((item, idx) => {
            const text =
              (item.userName !== '' ? item.userName : 'somebody') +
              (item.actionType === ActionTypeMore.QUESTIONNAIRE
                ? ' answered the question'
                : item.actionType === ActionTypeMore.UPLOAD_IMAGE
                ? ' upload a image'
                : '');
            const timeDiff =
              dateNow.getTime() - new Date(item.submitTime).getTime();
            const timeDiffText =
              timeDiff / 24 / 60 / 60 / 1000 >= 1
                ? Math.floor(timeDiff / 24 / 60 / 60 / 1000) + 'd'
                : timeDiff / 60 / 60 / 1000 >= 1
                ? Math.floor(timeDiff / 60 / 60 / 1000) + 'h'
                : timeDiff / 60 / 1000 >= 1
                ? Math.floor(timeDiff / 60 / 1000) + 'm'
                : Math.floor(timeDiff / 1000) + 's';
            console.log(
              item.actionType,
              new Date(item.submitTime),
              text,
              timeDiff
            );
            return (
              <div
                className="item"
                key={idx}
                onClick={() => setPassModalData(item)}
              >
                <span className="text">{text}</span>
                <span className="time">{timeDiffText}</span>
              </div>
            );
          })}
        </WorkProofListBox>
      </WorkProofBox>
      <PassModal
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
    </>
  ) : (
    <></>
  );
}

const WorkProofListBox = styled.div`
  margin-top: 20px;
  & div.item {
    position: relative;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #333333;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    cursor: pointer;
  }
  .green {
    color: #3dd606;
  }
`;

const WorkProofBox = styled.div`
  padding: 20px;
  & .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    & h3 {
      margin: 0px;
      font-weight: 700;
      font-size: 20px;
      line-height: 30px;
      color: #333333;
    }
  }
`;
