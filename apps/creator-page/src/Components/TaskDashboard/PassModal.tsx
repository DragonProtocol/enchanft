import Modal from 'react-modal';
import styled from 'styled-components';
import { WorkProofInfo } from '../../redux/creatorDashboard';
import IconClose from '../Icons/IconClose';

export default function PassModal({
  data,
  closeModal,
  submit
}: {
  data: WorkProofInfo | undefined
  closeModal: () => void;
  submit: (pass: boolean) => void;
}) {
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
        <p>A: {data?.actionData.answer}</p>
        <div className="btns">
          <button className="nopass" onClick={() => submit(false)}>
            No Pass
          </button>
          <button className="pass" onClick={() => submit(true)}>
            Pass
          </button>
        </div>
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
`;
