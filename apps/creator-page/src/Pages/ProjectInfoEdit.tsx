import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../Components/Loading';
import { fetchProjectDetail, selectProjectDetail } from '../redux/projectSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import slugify from 'slugify';

import ProjectName from '../Components/Project/Name';
import ProjectDesc from '../Components/Project/Desc';
import ProjectSymbol from '../Components/Project/Symbol';
import ProjectWebsite from '../Components/Project/Website';
import ProjectAttachFile from '../Components/Project/AttachFile';
import ProjectTwitterLink from '../Components/Project/TwitterLink';
import ProjectTwitterLinkInput from '../Components/Project/TwitterLinkInput';
import ProjectInviteBot from '../Components/Project/InviteBot';
import ProjectInviteBotInput from '../Components/Project/InviteBotInput';
import ProjectTotalSupply from '../Components/Project/TotalSupply';
import ProjectBlockchain from '../Components/Project/Blockchain';
import { EditBox, EditTitle } from '../Components/Project/EditTitle';

import {
  uploadImage as uploadImageApi,
  getTwitterSubScriptions,
  bindTwitterSubScription,
  projectBindBot,
  updateProject,
  creatorTwitter,
} from '../api';
import { useAppConfig } from '../AppProvider';
import TwitterInputModal from '../Components/Project/TwitterInputModal';
import { TASK_IMAGE_SIZE_LIMIT } from '../utils/constants';
import { toast } from 'react-toastify';
import UploadImgModal from '../Components/UploadImgModal';
import { BlockchainType } from '../Components/Project/types';
import { AxiosError } from 'axios';
import isEqual from '../utils/isEqual';
import log from 'loglevel';
import {
  connectionSocialMedia,
  TWITTER_CALLBACK_URL,
} from '../utils/socialMedia';

export default function ProjectInfoEdit() {
  const { account, updateAccount, isAdmin, isCreator, isVIP } = useAppConfig();
  const { slug } = useParams();
  const { data } = useAppSelector(selectProjectDetail);
  const dispatch = useAppDispatch();
  // TODO fix any
  const [project, setProject] = useState<any>({ ...data });
  const [showTwitterInputModal, setShowTwitterInputModal] = useState(false);
  const [twitter, setTwitter] = useState<{
    url: string;
    oauthToken: string;
    oauthTokenSecret: string;
  }>();
  const [hasInviteBot, setHasInviteBot] = useState(
    !!project?.community.discordId
  );
  const [showModal, setShowModal] = useState(false);
  const [couldSave, setCouldSave] = useState(false);
  const [hasTwitter, setHasTwitter] = useState(false);

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
          image: data.url,
        });
        e.target.value = '';
        toast.success('upload success');
      } catch (error) {
        const err: AxiosError = error as any;
        if (err.response?.status === 401) {
          toast.error('Login has expired,please log in again!');
          updateAccount({ ...account, info: null });
        } else {
          toast.error('upload fail');
        }
      } finally {
        setShowModal(false);
      }
    },
    [account, project, updateAccount]
  );

  const saveProject = useCallback(async () => {
    if (!account.info?.token || !slug) return;
    try {
      await updateProject(project, account.info?.token);
      dispatch(fetchProjectDetail({ slug, token: account.info.token }));
      toast.success('save success!');
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
    [project.id, account, updateAccount]
  );

  useEffect(() => {
    if (!isEqual(data, project)) {
      setCouldSave(true);
    } else {
      setCouldSave(false);
    }
  }, [data, project]);

  useEffect(() => {
    setProject({ ...data });
  }, [data]);
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
      if (!account.info?.token || !TWITTER_CALLBACK_URL) return;
      const { newValue, key, url } = e;
      if ('social_auth' === key) {
        const { code, type } = JSON.parse(newValue || '');
        console.log('social_auth change url', url, code, type);
        if (code && type === 'TWITTER') {
          creatorTwitter(
            { code, callback: TWITTER_CALLBACK_URL },
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
  }, [account.info?.token]);

  if (data?.slug !== slug) return <Loading />;

  log.debug('project', project);
  return (
    <EditBox>
      <EditTitle
        title="Edit Project Information"
        save={saveProject}
        couldSave={couldSave}
      />
      <div className="info">
        <div className="left">
          <ProjectName
            name={project?.name || ''}
            setName={(n) => {
              const slug = slugify(n.toLowerCase());
              setProject({
                ...project,
                name: n,
                slug: slug,
              });
            }}
          />
          <ProjectDesc
            desc={project?.description || ''}
            setDesc={(d) => {
              setProject({
                ...project,
                description: d,
              });
            }}
          />
          <ProjectSymbol customUrl={project?.slug} setCustomUrl={() => {}} />
          <ProjectWebsite
            websiteUrl={project.community.website || ''}
            setWebsiteUrl={(url) => {
              setProject({
                ...project,
                community: {
                  ...project.community,
                  website: url,
                },
              });
            }}
          />
          <ProjectTotalSupply
            supply={project.itemTotalNum || ''}
            setSupply={(value) => {
              setProject({
                ...project,
                itemTotalNum: Number(value),
              });
            }}
          />
          {/* <ProjectStatus
            state={project.status}
            setState={(state) => {
              setProject({
                ...project,
                status: state,
              });
            }}
          /> */}
        </div>
        <div className="right">
          <ProjectAttachFile
            img={project?.image}
            uploadImageHandler={uploadImageHandler}
          />
          {(() => {
            if (isAdmin) {
              return (
                <ProjectTwitterLinkInput
                  twitterName={project?.community?.twitterName || ''}
                  setTwitterName={(name) => {
                    setProject({
                      ...project,
                      community: {
                        ...project.community,
                        twitterName: name,
                      },
                    });
                  }}
                />
              );
            }
            if (isVIP) {
              return (
                <ProjectTwitterLink
                  hasTwitter={
                    project?.community?.twitterId &&
                    project?.community?.twitterName
                  }
                  twitterName={project?.community?.twitterName || ''}
                  linkAction={async () => {
                    if (!account.info?.token) return;
                    try {
                      const resp = await getTwitterSubScriptions(
                        account.info.token
                      );
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
                  }}
                />
              );
            }
            return (
              <ProjectTwitterLink
                hasTwitter={
                  hasTwitter ||
                  (project?.community?.twitterId &&
                    project?.community?.twitterName)
                }
                twitterName={project?.community?.twitterName || ''}
                linkAction={async () => {
                  connectionSocialMedia('twitter');
                }}
              />
            );
          })()}
          {(isAdmin && (
            <ProjectInviteBotInput
              botUrl={project?.community?.discordInviteUrl || ''}
              setBotUrl={(url) => {
                setProject({
                  ...project,
                  community: {
                    ...project.community,
                    discordInviteUrl: url,
                  },
                });
              }}
            />
          )) || <ProjectInviteBot hasInviteBot={hasInviteBot} />}
          <ProjectBlockchain
            blockchain={
              project?.chainId === -1
                ? BlockchainType.Solana
                : project?.chainId === 1
                ? BlockchainType.Ethereum
                : BlockchainType.Aptos
            }
            setBlockchain={(b) => {
              setProject({
                ...project,
                chainId:
                  b === BlockchainType.Solana
                    ? -1
                    : b === BlockchainType.Ethereum
                    ? 1
                    : 2,
              });
            }}
          />
        </div>
      </div>
      <UploadImgModal show={showModal} closeModal={() => setShowModal(false)} />
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
    </EditBox>
  );
}
