import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Loading from '../Components/Loading';
import { selectProjectDetail } from '../redux/projectSlice';
import { useAppSelector } from '../redux/store';
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

import { uploadImage as uploadImageApi, getTwitterSubScriptions } from '../api';
import { useAppConfig } from '../AppProvider';
import TwitterInputModal from '../Components/Project/TwitterInputModal';
import { TASK_IMAGE_SIZE_LIMIT } from '../utils/constants';
import { toast } from 'react-toastify';
import UploadImgModal from '../Components/UploadImgModal';

export default function ProjectInfoEdit() {
  const { account } = useAppConfig();
  const { slug } = useParams();
  const { data } = useAppSelector(selectProjectDetail);

  // TODO fix any
  const [project, setProject] = useState<any>(data);
  const [showTwitterInputModal, setShowTwitterInputModal] = useState(false);
  const [twitter, setTwitter] = useState<{
    url: string;
    oauthToken: string;
    oauthTokenSecret: string;
  }>();
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

  if (data?.slug !== slug) return <Loading />;

  console.log(project);
  return (
    <EditBox>
      <EditTitle title="Edit Project Information" save={() => {}} />
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
            websiteUrl={project.community.website}
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
          <ProjectTotalSupply supply="" setSupply={() => {}} />
          <ProjectStatus
            state={project.state}
            setState={(state) => {
              setProject({
                ...project,
                state,
              });
            }}
          />
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
          <ProjectInviteBot />
          <ProjectBlockchain
            blockchain={project?.blockchain}
            setBlockchain={(b) => {
              setProject({
                ...project,
                blockchain: b,
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
        bindAction={(code: string) => {
          console.log(code);
        }}
      />
    </EditBox>
  );
}
