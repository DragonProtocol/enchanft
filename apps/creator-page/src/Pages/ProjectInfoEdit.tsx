import { useState } from 'react';
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

export default function ProjectInfoEdit() {
  const { slug } = useParams();
  const { data } = useAppSelector(selectProjectDetail);

  // TODO fix any
  const [project, setProject] = useState<any>(data);

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
          <ProjectWebsite websiteUrl="" setWebsiteUrl={() => {}} />
          <ProjectTotalSupply supply="" setSupply={() => {}} />
          <ProjectStatus status={project.blockchain} setStatus={() => {}} />
        </div>
        <div className="right">
          <ProjectAttachFile
            img={project?.image}
            uploadImageHandler={() => {}}
          />
          <ProjectTwitterLink />
          <ProjectInviteBot />
          <ProjectBlockchain
            blockchain={project?.blockchain}
            setBlockchain={() => {}}
          />
        </div>
      </div>
    </EditBox>
  );
}
