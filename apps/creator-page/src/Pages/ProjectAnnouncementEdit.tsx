import { EditBox, EditTitle } from '../Components/Project/EditTitle';
import ProjectName from '../Components/Project/Name';
import ProjectDesc from '../Components/Project/Desc';
import { useCallback, useState } from 'react';
import { useAppConfig } from '../AppProvider';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import { selectProjectDetail } from '../redux/projectSlice';

export default function ProjectAnnouncementEdit() {
  const { account } = useAppConfig();
  const { slug } = useParams();
  const { data } = useAppSelector(selectProjectDetail);

  // TODO fix any
  const [project, setProject] = useState<any>({ ...data });
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const saveProject = useCallback(() => {
    if (!account.info?.token) return;
    // TODO
    alert('coming soon');
  }, [account.info?.token]);
  return (
    <EditBox>
      <EditTitle title="Edit Announcement" save={saveProject} />
      <div className="info">
        <div className="left">
          <ProjectName
            title="Announcement Title"
            name={name || ''}
            setName={(n) => {
              setName(n);
            }}
          />
          <ProjectDesc
            title="Announcement"
            desc={desc}
            setDesc={(d) => {
              setDesc(d);
            }}
          />
        </div>
      </div>
    </EditBox>
  );
}
