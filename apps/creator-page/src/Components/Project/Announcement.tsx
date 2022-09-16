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
        <h4>📣 {project.announcement?.title || ''}</h4>
        <div className="desc">
          <p>{project.announcement?.text || ''}</p>
        </div>
      </div>
    </AnnouncementBox>
  );
}

const AnnouncementBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  & h4 {
    margin: 0;
    margin-bottom: 20px;
  }

  & .desc {
    height: auto;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #333333;

    & > p {
      margin: 0;
      white-space: pre-wrap;
    }
  }
`;
