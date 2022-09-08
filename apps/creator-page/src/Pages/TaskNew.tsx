import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import log from 'loglevel';
import {
  State as CreateTaskState,
  DefaultState,
} from '../Components/TaskCreate/type';
import Basic from '../Components/TaskCreate/Basic';
import Actions from '../Components/TaskCreate/Actions';
import PreviewBtn from '../Components/TaskCreate/PreviewBtn';
import Preview from '../Components/TaskCreate/Preview';
import { useAppConfig } from '../AppProvider';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchProjectDetail, selectProjectDetail } from '../redux/projectSlice';
import ConfirmModal from '../Components/TaskCreate/ConfirmModal';
import { toast } from 'react-toastify';
import { createTask, projectBindBot } from '../api';

export default function TaskNew() {
  const { slug } = useParams();
  const { account, validLogin } = useAppConfig();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: project } = useAppSelector(selectProjectDetail);

  const [openPreview, setOpenPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasInviteBot, setHasInviteBot] = useState(
    !!project?.community.discordId
  );

  const [state, setState] = useState<CreateTaskState>({
    ...DefaultState,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTask = useCallback(async () => {
    if (!slug || !account.info?.token || !project || !validLogin) return;
    if (state.actions.length === 0) {
      toast.error('cannot create task without action!!!');
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const resp = await createTask(
        { ...state, projectId: project.id },
        account.info.token
      );
      dispatch(fetchProjectDetail({ slug, token: account.info.token }));
      navigate(`/project/${slug}/task/${resp.data.data.id}`);
    } catch (error) {
      toast.error('create fail');
    }
    setShowModal(false);
    setIsSubmitting(false);
  }, [
    slug,
    account.info?.token,
    project,
    validLogin,
    state,
    isSubmitting,
    dispatch,
    navigate,
  ]);

  const projectBind = useCallback(
    async (guildId: string) => {
      if (!project?.id || !account.info?.token) return;
      await projectBindBot({
        projectId: project.id,
        discordId: guildId,
        token: account.info.token,
      });
      setHasInviteBot(true);
    },
    [project?.id, account.info?.token]
  );

  useEffect(() => {
    localStorage.setItem('discord_guild_id', JSON.stringify({ guildId: null }));
    const handleStorageChange = (e: StorageEvent) => {
      const { newValue, key } = e;
      if ('discord_guild_id' === key) {
        const { guildId } = JSON.parse(newValue || '{}');
        if (guildId) projectBind(guildId);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [projectBind]);

  if (!project) return null;

  log.debug({ project });
  return (
    <>
      <NewBox style={{ display: (openPreview && 'none') || '' }}>
        <h3 className="title">Create a New Task</h3>
        <Basic
          state={state}
          updateState={(newState) => {
            setState({ ...newState });
          }}
        />

        <Actions
          hasInviteBot={hasInviteBot || !!project.community.discordId}
          updateStateActions={(newStateActions) => {
            setState({ ...state, actions: newStateActions });
          }}
          projectName={project.name}
          projectTwitter={project.community.twitter}
          followTwitters={state.followTwitters}
          updateStateFollowTwitters={(data) => {
            setState({ ...state, followTwitters: data });
          }}
        />
        <PreviewBtn
          state={state}
          updateState={(newState) => {
            setState({ ...newState });
          }}
          passAction={() => {
            setOpenPreview(true);
          }}
        />
      </NewBox>
      <Preview
        state={state}
        projectName={project.name}
        open={openPreview}
        closeHandler={() => setOpenPreview(false)}
        submitResult={() => {
          setShowModal(true);
        }}
      />
      <ConfirmModal
        show={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
        confirmSubmit={submitTask}
      />
    </>
  );
}

const NewBox = styled.div`
  padding: 40px;
  background: #f7f9f1;
  border: 4px solid #333333;
  & h3 {
    margin: 0;
  }
  & .title {
    font-weight: 700;
    font-size: 36px;
    line-height: 40px;
    color: #333333;
  }

  & .subtitle {
    margin-top: 40px;
    border-bottom: 1px solid #d9d9d9;
    margin-bottom: 10px;
    & span {
      display: inline-block;
      font-weight: 700;
      font-size: 24px;
      line-height: 40px;
      border-bottom: 4px solid #3dd606;
    }
  }
`;
