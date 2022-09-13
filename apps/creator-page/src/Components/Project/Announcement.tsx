import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ProjectDetail } from '../../redux/projectSlice';

export default function Announcement({ project }: { project: ProjectDetail }) {
  const navigate = useNavigate();
  return (
    <AnnouncementBox>
      <div className="title">
        <h3>Announcement</h3>
        <button
          onClick={() => {
            navigate(`/project/${project.slug}/announcement/edit`);
          }}
        >
          Edit
        </button>
      </div>
      <div>
        <h4>📣 WL RULES</h4>
      </div>
    </AnnouncementBox>
  );
}

const AnnouncementBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
