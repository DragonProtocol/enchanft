import { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { WorkProofInfo } from '../../redux/creatorDashboard';
import IconClose from '../Icons/IconClose';
import { ActionType } from '../TaskCreate/type';

export default function PassModal({
  nopassMode,
  data,
  closeModal,
  submit,
}: {
  nopassMode?: boolean;
  data: WorkProofInfo | undefined;
  closeModal: () => void;
  submit: (pass: boolean, feedback: string) => void;
}) {
  const [confirmState, setConfirmState] = useState(nopassMode);
  const [noPassReason, setNoPassReason] = useState('');
  return (
    <Modal
      isOpen={data !== undefined}
      contentLabel="Work Proof"
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 200,
          backdropFilter: 'blur(12px)',
        },
        content: {
          display: 'flex',
          alignItems: 'center',
          margin: '0 auto',
          background: 'none',
          border: 'none',
        },
      }}
    >
      <ContentBox>
        <div className="header">
          <h3>Work Proof</h3>
          <button title="close" onClick={closeModal}>
            <IconClose size="20px" />
          </button>
        </div>
        <p>{data?.userName || 'Somebody'}</p>
        <p>Q: {data?.actionData.question}</p>
        {data?.actionType === ActionType.QUESTIONNAIRE && (
          <p>A: {data?.actionData.answer}</p>
        )}
        {data?.actionType === ActionType.UPLOAD_IMAGE && (
          <img
            src={data.actionData.answer}
            alt={data.actionData.question}
          ></img>
        )}
        {confirmState ? (
          <>
            <p>Feedback: </p>
            <div className="input-box">
              <input
                type="text"
                title="feedback"
                placeholder="no pass reason"
                value={noPassReason}
                onChange={(e) => {
                  setNoPassReason(e.target.value);
                }}
              />
            </div>
            <div className="btns">
              <button
                className="nopass"
                onClick={() => {
                  if (nopassMode) {
                    closeModal();
                  } else {
                    setConfirmState(false);
                  }
                }}
              >
                Back
              </button>
              <button
                className="pass"
                onClick={() => submit(false, noPassReason)}
              >
                Sent
              </button>
            </div>
          </>
        ) : (
          <div className="btns">
            <button className="nopass" onClick={() => setConfirmState(true)}>
              No Pass
            </button>
            <button className="pass" onClick={() => submit(true, '')}>
              Pass
            </button>
          </div>
        )}
      </ContentBox>
    </Modal>
  );
}

const ContentBox = styled.div`
  margin: 0 auto;
  text-align: start;
  background: #f7f9f1;
  border-radius: 20px;
  width: 400px;
  padding: 20px 20px;

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
  & p {
    margin: 0;
    font-size: 20px;
    color: #333333;
    margin-bottom: 10px;
  }

  & .btns {
    display: flex;
    justify-content: end;

    & button {
      cursor: pointer;
      background: #ebeee4;
      margin-top: 20px;
      padding: 0 20px;
      border: none;
      height: 48px;
      font-size: 20px;
      box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
      border-radius: 10px;
    }

    & button.pass {
      background-color: #3dd606;
      margin-left: 20px;
      color: #fff;
    }
    & button.nopass {
      background-color: #ff2222;
      margin-left: 20px;
      color: #fff;
    }
  }

  & div.input-box {
    flex-grow: 1;
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    font-size: 14px;
    line-height: 20px;
    > input {
      flex-grow: 1;
      border: none;
      outline: none;
    }
    > svg {
      height: 20px;
    }
    &.adding {
      color: rgba(51, 51, 51, 0.3);
    }
  }
`;
