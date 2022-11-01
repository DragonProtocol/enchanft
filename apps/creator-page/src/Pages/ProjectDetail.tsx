import {
  selectProjectDetail,
  ProjectDetail,
  fetchProjectDetail,
  GradeType,
} from '../redux/projectSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import ProjectInfo from '../Components/Project/Info';
import ProjectAnnouncement from '../Components/Project/Announcement';
import MintInfo from '../Components/Project/MintInfo';
import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';
import { MintStage } from '../Components/Project/types';
import { useAppConfig } from '../AppProvider';
import {
  bindTwitterSubScription,
  creatorTwitter,
  getTwitterSubScriptions,
  projectBindBot,
  updateProject,
} from '../api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import Loading from '../Components/Loading';
import { TWITTER_CALLBACK_URL } from '../utils/socialMedia';
import TwitterInputModal from '../Components/Project/TwitterInputModal';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { data } = useAppSelector(selectProjectDetail);
  const { account, updateAccount, isAdmin } = useAppConfig();
  const dispatch = useAppDispatch();

  const [project, setProject] = useState<ProjectDetail | null>(
    data && { ...data }
  );
  const [hasInviteBot, setHasInviteBot] = useState(
    !!project?.community.discordId
  );
  const [hasTwitter, setHasTwitter] = useState(false);
  const [twitter, setTwitter] = useState<{
    url: string;
    oauthToken: string;
    oauthTokenSecret: string;
  }>();
  const [showTwitterInputModal, setShowTwitterInputModal] = useState(false);

  useEffect(() => {
    if (!account.info?.token || !slug) return;
    dispatch(fetchProjectDetail({ slug: slug, token: account.info.token }));
  }, [slug, account.info?.token, dispatch]);

  useEffect(() => {
    setProject(data && { ...data });
  }, [data]);

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
        }
      }
    },
    [project?.id, account, updateAccount]
  );

  const linkAction = useCallback(async () => {
    if (!account.info?.token) return;
    try {
      const resp = await getTwitterSubScriptions(account.info.token);
      const { data } = resp;
      setTwitter(data.data);
      const winParams = `width=480,height=800,top=0,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no`;
      window.open(data.data.url, '__blank', winParams);
      setShowTwitterInputModal(true);
    } catch (error) {
      const err: AxiosError = error as any;
      if (err.response?.status === 401) {
        toast.error('Login has expired,please log in again!');
        updateAccount({ ...account, info: null });
      }
    }
  }, [account, updateAccount]);

  const saveProject = useCallback(async () => {
    if (!account.info?.token || !slug || !project) return;
    try {
      await updateProject(project, account.info?.token);
      toast.success('save success!');
      dispatch(
        fetchProjectDetail({ slug: project.slug, token: account.info.token })
      );
    } catch (error) {
      const err: AxiosError = error as any;
      if (err.response?.status === 401) {
        toast.error('Login has expired,please log in again!');
        updateAccount({ ...account, info: null });
      } else {
        toast.error('save fail!');
      }
    }
  }, [account, dispatch, project, slug, updateAccount]);

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

  useEffect(() => {
    localStorage.setItem(
      'social_auth',
      JSON.stringify({ code: null, type: null })
    );
    const handleStorageChange = (e: StorageEvent) => {
      if (!account.info?.token || !TWITTER_CALLBACK_URL || !data) return;
      const { newValue, key, url } = e;
      if ('social_auth' === key) {
        const { code, type } = JSON.parse(newValue || '');
        console.log('social_auth change url', url, code, type);
        if (code && type === 'TWITTER') {
          creatorTwitter(
            {
              code,
              callback: TWITTER_CALLBACK_URL,
              projectId: data.id,
              communityId: data.community.id,
            },
            account.info.token
          ).then(() => {
            setHasTwitter(true);
          });
          // setTwitterCode(code);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [account.info?.token, data]);

  const isVIP = useMemo(() => {
    return data?.grade === GradeType.VIP || false;
  }, [data]);

  if (!project) return null;
  if (project?.slug !== slug) return <Loading />;

  console.log({ project });
  return (
    <DetailBox>
      <ProjectInfo
        isAdmin={isAdmin}
        isVIP={isVIP}
        hasInviteBot={hasInviteBot}
        hasTwitter={hasTwitter}
        project={project}
        setProject={(data) => {
          setProject(data);
        }}
        saveAction={saveProject}
        linkAction={linkAction}
      />
      <ProjectAnnouncement project={project} />
      {project.mintStage === MintStage.SOLDOUT ? null : (
        <MintInfo project={project} />
      )}

      <TwitterInputModal
        show={showTwitterInputModal}
        closeModal={() => {
          setShowTwitterInputModal(false);
        }}
        bindAction={async (code: string) => {
          if (
            !twitter?.oauthToken ||
            !twitter.oauthTokenSecret ||
            !account.info?.token
          )
            return;
          try {
            const resp = await bindTwitterSubScription(
              {
                pin: code,
                oauthToken: twitter.oauthToken,
                oauthTokenSecret: twitter.oauthTokenSecret,
                communityId: project.community.id,
              },
              account.info.token
            );
            console.log(code, resp.data);
            toast.success('bind success!');
            if (slug)
              dispatch(fetchProjectDetail({ slug, token: account.info.token }));
            setShowTwitterInputModal(false);
          } catch (error) {
            const err: AxiosError = error as any;
            if (err.response?.status === 401) {
              toast.error('Login has expired,please log in again!');
              updateAccount({ ...account, info: null });
            } else {
              toast.error('bind fail! Please retry');
            }
          }
        }}
      />
    </DetailBox>
  );
}

const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  > div {
    border-radius: inherit;
    padding: 40px;
    background: #f7f9f1;
    border: 4px solid #333333;
  }

  & .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > h3 {
      margin: 0;
      font-weight: 700;
      font-size: 24px;
      line-height: 36px;
      color: #333333;
    }

    > button {
      padding: 10px 18px;
      height: 48px;
      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #ffffff;
    }
  }
`;
