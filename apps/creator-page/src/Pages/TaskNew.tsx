import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import log from 'loglevel';
import {
  State as CreateTaskState,
  DefaultState,
  RewardType,
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
import { AxiosError } from 'axios';
import IconDel from '../Components/Icons/IconDel';
import Information from '../Components/TaskCreate/Information';
import TaskReward from '../Components/TaskCreate/TaskReward';
import StepOne from '../Components/TaskCreate/StepOne';
import StepTwo from '../Components/TaskCreate/StepTwo';

export default function TaskNew() {
  const { slug } = useParams();
  const { account, validLogin, updateAccount, isCreator } = useAppConfig();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: project } = useAppSelector(selectProjectDetail);
  const [step, setStep] = useState(1);

  const [openPreview, setOpenPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasInviteBot, setHasInviteBot] = useState(
    !!project?.community.discordId
  );

  const [state, setState] = useState<CreateTaskState>({
    ...DefaultState,
    reward:
      project?.whitelists && project?.whitelists.length > 0
        ? {
            ...DefaultState.reward,
            whitelist_id: project?.whitelists[0].id,
          }
        : {
            ...DefaultState.reward,
            type: RewardType.OTHERS,
          },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTask = useCallback(async () => {
    if (!slug || !account.info?.token || !project || !validLogin || !isCreator)
      return;

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
      const err: AxiosError = error as any;
      if (err.response?.status === 401) {
        toast.error('Login has expired,please log in again!');
        updateAccount({ ...account, info: null });
      } else {
        toast.error('create fail');
      }
    }
    setShowModal(false);
    setIsSubmitting(false);
  }, [
    slug,
    account,
    project,
    validLogin,
    isCreator,
    state,
    isSubmitting,
    dispatch,
    navigate,
    updateAccount,
  ]);

  const projectBind = useCallback(
    async (guildId: string) => {
      if (!project?.id || !account.info?.token) return;
      try {
        await projectBindBot({
          projectId: project.id,
          discordId: guildId,
          token: account.info.token,
        });
        setHasInviteBot(true);
      } catch (error) {
        const err: AxiosError = error as any;
        if (err.response?.status === 401) {
          toast.error('Login has expired,please log in again!');
          updateAccount({ ...account, info: null });
        } else {
          toast.error('Bind WL Bot Fail.');
        }
      }
    },
    [project?.id, account, updateAccount]
  );

  const checkInformationValid = useCallback(() => {
    if (!state.name) {
      toast.error('Task title is required');
      return;
    }
    if (!state.description) {
      toast.error('Task statement is required');
      return;
    }
    return true;
  }, [state]);

  const checkTaskRewardValid = useCallback(() => {
    if (state.reward.type === RewardType.OTHERS) {
      if (!state.reward.name) {
        toast.error('Reward name is required when the type is other');
        return;
      }
    }
    return true;
  }, [state]);

  const checkTaskActionValid = useCallback(() => {
    if (state.actions.length === 0) {
      toast.error('Task actions must have one item at least');
      return;
    }
    return true;
  }, [state]);

  const checkValid = useCallback(() => {
    if (step === 1) return checkInformationValid();
    if (step === 2) return checkTaskRewardValid();
    if (step === 3) return checkTaskActionValid();
    return true;
  }, [checkInformationValid, checkTaskActionValid, checkTaskRewardValid, step]);

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

  log.debug({ state });
  return (
    <>
      <NewBox style={{ display: (openPreview && 'none') || '' }}>
        <div className="title">
          <h3>Create a New Task</h3>
          <button
            title="del"
            onClick={() => {
              navigate(-1);
            }}
          >
            <IconDel size="20px" />
          </button>
        </div>
        <div className="tar-bar">
          <div
            className={step === 1 ? 'active' : ''}
            onClick={() => {
              if (checkValid()) setStep(1);
            }}
          >
            1. Information
          </div>
          <div
            className={step === 2 ? 'active' : ''}
            onClick={() => {
              if (checkValid()) setStep(2);
            }}
          >
            2. Task Reward
          </div>
          <div
            className={step === 3 ? 'active' : ''}
            onClick={() => {
              if (checkValid()) setStep(3);
            }}
          >
            3. Task Action
          </div>
        </div>

        {step === 1 && (
          <>
            <Information
              hasInviteBot={hasInviteBot || !!project.community.discordId}
              state={state}
              whitelist={project.whitelists}
              updateState={(newState) => {
                setState({ ...newState });
              }}
            />
            <StepOne
              nextAction={() => {
                if (checkValid()) setStep(step + 1);
              }}
              cancelAction={() => {
                navigate(-1);
              }}
            />
          </>
        )}

        {step === 2 && (
          <>
            <TaskReward
              hasInviteBot={hasInviteBot || !!project.community.discordId}
              state={state}
              whitelist={project.whitelists}
              updateState={(newState) => {
                setState({ ...newState });
              }}
            />
            <StepTwo
              nextAction={() => {
                if (checkValid()) setStep(step + 1);
              }}
              backAction={() => {
                setStep(step - 1);
              }}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Actions
              hasInviteBot={hasInviteBot || !!project.community.discordId}
              updateStateActions={(newStateActions) => {
                setState({ ...state, actions: newStateActions });
              }}
              projectName={project.name}
              projectTwitter={project.community.twitterName}
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
              backAction={() => {
                setStep(step - 1);
              }}
              passAction={() => {
                setOpenPreview(true);
              }}
            />
          </>
        )}
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
    justify-content: space-between;
    align-items: center;
    display: flex;

    & h3 {
      font-weight: 700;
      font-size: 36px;
      line-height: 40px;
      color: #333333;
    }

    & button {
      width: 48px;
      height: 48px;
      background: #ebeee4;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;

      & svg {
        vertical-align: middle;
      }
    }
  }

  & .tar-bar {
    border-bottom: 1px solid #d9d9d9;
    width: calc(100% + 80px);
    margin-left: -40px;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    gap: 80px;
    margin-top: 40px;
    > div {
      cursor: pointer;
      font-weight: 700;
      font-size: 24px;
      line-height: 40px;
      color: #333333;
      padding: 10px;
      &.active {
        border-bottom: 4px solid #3dd606;
      }
    }
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
