import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useAppConfig } from '../AppProvider';
import { TASK_IMAGE_SIZE_LIMIT } from '../utils/constants';

import UploadImgModal from './UploadImgModal';
import { uploadImage as uploadImageApi } from '../api';

import ProjectName from './Project/Name';
import ProjectDesc from './Project/Desc';
import ProjectAttachFile from './Project/AttachFile';
import { BlockchainType, Project } from './Project/types';
import Blockchain from './Project/Blockchain';

export default function ProjectCreate({
  cancelEdit,
  submitProject,
}: {
  cancelEdit: () => void;
  submitProject: (project: Project) => void;
}) {
  const { account } = useAppConfig();

  const [showModal, setShowModal] = useState(false);
  const [project, setProject] = useState<Project>({
    name: '',
    desc: '',
    img: '',
    blockchain: BlockchainType.Solana,
    minted: false,
  });

  const uploadImageHandler = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if ((file as File).size > TASK_IMAGE_SIZE_LIMIT) {
        toast.error('File Too Large. 1M Limit');
        return;
      }
      setShowModal(true);

      if (!account.info?.token) return;

      try {
        const { data } = await uploadImageApi(file, account.info.token);
        setProject({
          ...project,
          img: data.url,
        });
        e.target.value = '';
        toast.success('upload success');
      } catch (error) {
        toast.error('upload fail');
      } finally {
        setShowModal(false);
      }
    },
    [account.info?.token, project]
  );
  return (
    <>
      <CreateBox>
        <div className="title">
          <h3>Information</h3>
        </div>

        <div className="info">
          <div className="left">
            <ProjectName
              name={project.name}
              setName={(name) => {
                if (name.length > 40) return;
                setProject({
                  ...project,
                  name,
                });
              }}
            />
            <ProjectDesc
              desc={project.desc}
              setDesc={(desc) =>
                setProject({
                  ...project,
                  desc,
                })
              }
            />
          </div>
          <div className="right">
            <ProjectAttachFile
              img={project.img}
              uploadImageHandler={uploadImageHandler}
            />
          </div>
        </div>
        <div className="title">
          <h3>Other Setting</h3>
        </div>
        <div className="other">
          <Blockchain
            blockchain={project.blockchain}
            setBlockchain={(value) => {
              setProject({
                ...project,
                blockchain: value,
              });
            }}
          />
          <div>
            <h4>Have you already minted?</h4>
            <div
              className={project.minted ? 'switch active' : 'switch'}
              onClick={() => {
                setProject({
                  ...project,
                  minted: !project.minted,
                });
              }}
            >
              <span></span>
            </div>
          </div>
        </div>
        <div className="btns">
          <button onClick={cancelEdit}>Cancel</button>
          <button
            className="save"
            onClick={() => {
              submitProject(project);
            }}
          >
            Submit
          </button>
        </div>
      </CreateBox>
      <UploadImgModal show={showModal} closeModal={() => setShowModal(false)} />
    </>
  );
}

const CreateBox = styled.div`
  margin-top: 40px;

  & .title {
    border-bottom: 1px solid #d9d9d9;

    & h3 {
      height: 40px;
      padding-bottom: 6px;
      display: inline-block;
      font-weight: 700;
      font-size: 24px;
      line-height: 40px;
      color: #333333;
      border-bottom: 4px solid #3dd606;
    }
  }

  & h4 {
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    margin-top: 0px;
    margin-bottom: 10px;
    color: #333333;
  }

  & > div {
    margin-top: 20px;
  }
  & .info,
  & .other {
    display: flex;
    gap: 40px;
    & > div {
      box-sizing: border-box;
      width: 540px;
    }

    & div.left {
      display: flex;
      gap: 40px;
      flex-direction: column;
    }

    & div.right {
    }
  }

  & .other {
    & div.switch {
      display: inline-block;
      width: 100px;
      height: 50px;
      border-radius: 25px;
      padding: 5px;
      box-sizing: border-box;
      position: relative;
      background: #ebeee4;
      transition: all 0.1s ease-out;

      > span {
        cursor: pointer;
        position: absolute;
        border-radius: 50%;
        left: 5px;
        width: 40px;
        height: 40px;
        background: #fff;
        transition: all 0.1s ease-out;
      }

      &.active {
        background: #3dd606;
        & > span {
          left: 55px;
        }
      }
    }
  }

  & .btns {
    display: flex;
    gap: 20px;
    justify-content: end;

    & button {
      width: 210px;
      height: 48px;
      background: #ebeee4;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #333333;
    }

    & button.save {
      color: #fff;
      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
    }
  }
`;
