import Modal from 'react-modal';
import ReactLoading from 'react-loading';
import styled from 'styled-components';

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
        },
        content: {
          width: '400px',
          height: '220px',
          margin: '0 auto',
          padding: '25px 0',
          textAlign: 'center',
        },
      }}
    >
      <ContentBox>
        <ReactLoading
          type={'spin'}
          color={'#000'}
          height={'100%'}
          width={'100%'}
        />
        <p>Uploading Image</p>
      </ContentBox>
    </Modal>
  );
}

const ContentBox = styled.div`
  width: 40%;
  margin: 0 auto;
  & p {
    font-size: 20px;
    font-weight: 700;
  }
`;
