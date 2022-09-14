import { EditBox, EditTitle } from '../Components/Project/EditTitle';
import ProjectName from '../Components/Project/Name';
import ProjectDesc from '../Components/Project/Desc';
import { useState } from 'react';

export default function ProjectAnnouncementEdit() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  return (
    <EditBox>
      <EditTitle title="Edit Announcement" save={() => {}} />
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
