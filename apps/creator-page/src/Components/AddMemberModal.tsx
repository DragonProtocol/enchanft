import { useCallback, useRef, useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import IconClose from './Icons/IconClose';
import PngIconAdd from './Icons/PngIconAdd';

Modal.setAppElement('#add-member-modal');
export default function AddMemberModal({
  show,
  closeModal,
  downloadTemp,
  uploadCsvFile,
}: {
  show: boolean;
  closeModal: () => void;
  downloadTemp: () => void;
  uploadCsvFile: (file: File) => void;
}) {
  const [quickUpload, setQuickUpload] = useState(false);
  const [csvFile, setCsvFile] = useState<File | undefined>();
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
      {(quickUpload && (
        <ContentBox>
          <div className="header">
            <h3>Bulk add wallet address</h3>
            <button title="close" onClick={closeModal}>
              <IconClose size="20px" />
            </button>
          </div>
          <div className="intro">
            <p>
              Enter wallet addresses to add. A line break is required between
              each address.
            </p>
          </div>
          {/* <p>Add Member</p> */}
          <div className="download-temp">
            <button
              onClick={() => {
                setQuickUpload(false);
              }}
            >
              Upload File
            </button>
          </div>
          <div className="upload-area">
            <textarea
              title="quick-upload"
              name=""
              id=""
              placeholder="e.g. 0x983snwdbueji9348953454353"
            ></textarea>
          </div>
          <div className="quick-upload">
            <button
              onClick={() => {
                csvFile && uploadCsvFile(csvFile);
              }}
            >
              Add
            </button>
          </div>
        </ContentBox>
      )) || (
        <ContentBox>
          <div className="header">
            <h3>Upload File</h3>
            <button title="close" onClick={closeModal}>
              <IconClose size="18px" />
            </button>
          </div>
          <div className="intro">
            <p>
              You will need to upload one of the Twitter name, Discord ID, and
              Wallet Address information, we can connect your uploaded user with
              the existing users.
            </p>
          </div>
          {/* <p>Add Member</p> */}
          <div className="download-temp">
            <button onClick={downloadTemp}>Download template file</button>
          </div>
          <div className="upload-area">
            <label htmlFor="upload-csv" id="upload-csv-label">
              <PngIconAdd />
              <p>Click to choose a file (CSV only)</p>
              {csvFile && <p>{csvFile.name}</p>}
            </label>
            <input
              id="upload-csv"
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                setCsvFile(file);
              }}
            />
          </div>
          <div className="quick-upload">
            {/* <p
              onClick={() => {
                setQuickUpload(!quickUpload);
              }}
            >
              Quick upload, bulk filling add wallet addresses👉
            </p> */}
            <button onClick={() => csvFile && uploadCsvFile(csvFile)}>
              Upload
            </button>
          </div>
        </ContentBox>
      )}
    </Modal>
  );
}

const ContentBox = styled.div`
  margin: 0 auto;
  text-align: start;
  background: #f7f9f1;
  border-radius: 20px;
  width: 600px;
  padding: 20px 20px;
  text-align: center;

  & p {
    margin: 0;
  }

  & .header {
    display: flex;
    justify-content: space-between;

    & h3 {
      margin: 0;
      font-weight: 700;
      font-size: 20px;
      line-height: 30px;
      color: #333333;
    }
  }

  & .intro {
    text-align: start;
    margin: 20px 0;
    & p {
      margin: 0;
      font-size: 15px;
    }
  }

  & .quick-upload {
    margin: 20px 0 10px 0;
    & p {
      font-size: 15px;
      text-decoration: underline;
    }

    & button {
      width: 240px;
    }
  }

  & .download-temp {
    text-align: start;
    margin: 20px 0;
  }

  & button:not([title='close']) {
    height: 48px;
    padding: 0 10px;

    background: #3dd606;
    box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;

    font-weight: 700;
    font-size: 18px;
    line-height: 27px;

    color: #ffffff;
  }

  & .upload-area {
    height: 200px;
    /* border: 1px dotted gray; */
    background-color: #ebeee4;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    > input {
      display: none;
    }

    > textarea {
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      border: none;
      outline: none;
      background: none;
      resize: none;
    }

    & img {
      width: 40px;
    }

    & p {
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
      color: #333333;
    }
  }

  & img {
    width: 80px;
  }
  & p {
    font-size: 20px;
    color: #333333;
  }
`;
