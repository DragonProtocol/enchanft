import { AxiosError } from 'axios';
import log from 'loglevel';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { createProject } from '../api';
import { useAppConfig } from '../AppProvider';
import BackBtn from '../Components/BackBtn';
import { BlockchainType, Project } from '../Components/Project/types';

import ProjectCreate from '../Components/ProjectCreate';
import RoleNeed from '../Components/RoleNeed';
import { fetchProjectList } from '../redux/projectListSlice';
import { useAppDispatch } from '../redux/store';

export default function ProjectNew() {
  const navigate = useNavigate();
  const { account, isAdmin, updateAccount } = useAppConfig();
  const dispatch = useAppDispatch();
  const [creating, setCreating] = useState(false);

  const cancelEdit = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const createNewProject = useCallback(
    async (project: Project) => {
      if (creating) return;
      if (!isAdmin) return;
      if (!account.info?.token) return;
      let chainId = -1;
      if (project.blockchain === BlockchainType.Solana) {
        chainId = -1;
      }
      if (project.blockchain === BlockchainType.Ethereum) {
        chainId = 1;
      }

      log.debug('createNewProject', project);
      setCreating(true);
      try {
        await createProject(
          {
            name: project.name,
            desc: project.desc,
            minted: project.minted,
            chainId: chainId,
            image: project.img,
          },
          account.info.token
        );

        dispatch(fetchProjectList({ token: account.info.token }));
        toast.success('create success!');
        navigate('/');
      } catch (error) {
        const err: AxiosError = error as any;
        if (err.response?.status === 401) {
          toast.error('Login has expired,please log in again!');
          updateAccount({ ...account, info: null });
        } else {
          toast.error('create fail!');
        }
      } finally {
        setCreating(false);
      }
    },
    [account, creating, dispatch, isAdmin, navigate, updateAccount]
  );

  if (!isAdmin) {
    return <RoleNeed content="Must Be Admin" />;
  }

  return (
    <CreateBox>
      <div className="title">
        <BackBtn
          clickAction={() => {
            navigate(-1);
          }}
        />
        <h3>Create a New Project</h3>
      </div>
      <ProjectCreate cancelEdit={cancelEdit} submitProject={createNewProject} />
    </CreateBox>
  );
}

const CreateBox = styled.div`
  padding: 40px;
  border-radius: inherit;
  padding: 40px;
  background: #f7f9f1;
  border: 4px solid #333333;

  & .title {
    display: flex;
    align-items: center;
    gap: 20px;
    & > h3 {
      margin: 0;
      display: inline;
      font-size: 36px;
      line-height: 40px;
      color: #333333;
    }
  }
`;
