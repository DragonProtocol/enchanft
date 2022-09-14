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
          <input
            title="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div>
          <button onClick={closeModal}>cancel</button>
          <button onClick={() => bindAction(code)}>bind</button>
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
  text-align: center;

  & img {
    width: 80px;
  }
  & p {
    font-size: 20px;
    color: #333333;
  }
`;
