import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
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
import ProjectInviteBot from '../Components/Project/InviteBot';
import ProjectTotalSupply from '../Components/Project/TotalSupply';
import ProjectBlockchain from '../Components/Project/Blockchain';
import ProjectStatus from '../Components/Project/Status';
import { EditBox, EditTitle } from '../Components/Project/EditTitle';

import {
  uploadImage as uploadImageApi,
  getTwitterSubScriptions,
  bindTwitterSubScription,
  projectBindBot,
  updateProject,
} from '../api';
import { useAppConfig } from '../AppProvider';
import TwitterInputModal from '../Components/Project/TwitterInputModal';
import { TASK_IMAGE_SIZE_LIMIT } from '../utils/constants';
import { toast } from 'react-toastify';
import UploadImgModal from '../Components/UploadImgModal';
import { BlockchainType } from '../Components/Project/types';

export default function ProjectInfoEdit() {
  const { account } = useAppConfig();
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

  const saveProject = useCallback(async () => {
    if (!account.info?.token || !slug) return;
    await updateProject(project, account.info?.token);
    dispatch(fetchProjectDetail({ slug, token: account.info.token }));
    toast.success('save success!');
  }, [account.info?.token, dispatch, project, slug]);

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

  if (data?.slug !== slug) return <Loading />;

  console.log(project);
  return (
    <EditBox>
      <EditTitle title="Edit Project Information" save={saveProject} />
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
            supply={project.itemTotalNum + ''}
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
          <ProjectTwitterLink
            linkAction={async () => {
              if (!account.info?.token) return;
              const resp = await getTwitterSubScriptions(account.info.token);
              const { data } = resp;
              setTwitter(data.data);
              const winParams = `width=480,height=800,top=0,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no`;
              window.open(data.data.url, '__blank', winParams);
              setShowTwitterInputModal(true);
            }}
          />
          <ProjectInviteBot hasInviteBot={hasInviteBot} />
          <ProjectBlockchain
            blockchain={
              project?.chainId === -1
                ? BlockchainType.Solana
                : BlockchainType.Ethereum
            }
            setBlockchain={(b) => {
              setProject({
                ...project,
                chainId: b === BlockchainType.Solana ? -1 : 1,
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
            setShowTwitterInputModal(false);
          } catch (error) {
            toast.error('bind fail! Please retry');
          }
        }}
      />
    </EditBox>
  );
}
