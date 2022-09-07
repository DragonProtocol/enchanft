import Modal from 'react-modal';
import styled from 'styled-components';
import Loading from '../Loading';

Modal.setAppElement('#upload-img-modal');
export default function UploadImgModal({
  show,
  closeModal,
}: {
  show: boolean;
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
        <Loading />
        <p>Uploading Image</p>
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
