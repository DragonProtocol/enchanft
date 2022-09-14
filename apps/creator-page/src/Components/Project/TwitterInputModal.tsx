import { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

Modal.setAppElement('#twitter-input-modal');
export default function TwitterInputModal({
  show,
  closeModal,
  bindAction,
}: {
  show: boolean;
  closeModal: () => void;
  bindAction: (arg0: string) => void;
}) {
  const [code, setCode] = useState('');
  return (
    <Modal
      isOpen={show}
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
        <div>
          <h3>Twitter Authorization</h3>
        </div>
        <div>
          <input
            title="code"
            placeholder="Enter your PIN number"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div>
          <p className="tint">You‘ll grant access to wl.xyz.</p>
        </div>
        <div className="btns">
          <button className="cancel" onClick={closeModal}>
            Cancel
          </button>
          <button className="confirm" onClick={() => bindAction(code)}>
            Authorize
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
  padding: 30px 20px 20px 20px;
  text-align: start;
  display: flex;
  flex-direction: column;
  gap: 20px;

  & img {
    width: 80px;
  }
  & p.tint {
    color: #333333;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin: 0;

    color: #333333;
  }

  & h3 {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    margin: 0;
    color: #333333;
  }

  & input {
    border: none;
    outline: none;

    background: #ebeee4;
    border-radius: 10px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;

    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
    font-family: inherit;
    color: #333333;
  }

  & .btns {
    margin-top: 20px;
    justify-content: end;
    display: flex;
    gap: 20px;
    & button {
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
    }
    & button.cancel {
      background: #ebeee4;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      color: #333333;
    }

    & button.confirm {
      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      color: #ffffff;
    }
  }
`;
