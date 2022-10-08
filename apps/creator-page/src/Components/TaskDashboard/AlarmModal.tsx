import Modal from 'react-modal';
import styled from 'styled-components';

Modal.setAppElement('#tweet-alarm-modal');
export default function AlarmModal({
  show,
  msg,
  closeModal,
}: {
  show: boolean;
  msg: string;
  closeModal: () => void;
}) {
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
        <p>{msg || 'No valid twitter user'}</p>
        <div className="btns">
          <button className="cancel" onClick={closeModal}>
            Ok
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
  padding: 30px 20px;

  & p {
    margin: 0;
    font-size: 20px;
    color: #333333;
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

    & button.confirm {
      background-color: #3dd606;
      margin-left: 20px;
      color: #fff;
    }
  }
`;
