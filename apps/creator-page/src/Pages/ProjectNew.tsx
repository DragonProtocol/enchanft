import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BackBtn from '../Components/BackBtn';
import { Project } from '../Components/Project/types';

import ProjectCreate from '../Components/ProjectCreate';

export default function ProjectNew() {
  const navigate = useNavigate();

  const cancelEdit = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const createNewProject = (project: Project) => {
    console.log('createNewProject', project);
    // TODO api
  };

  return (
    <CreateBox>
      <div className="title">
        <BackBtn
          clickAction={() => {
            navigate(-1);
          }}
        />
        <h3>Create a New Project</h3>
      </div>
      <ProjectCreate cancelEdit={cancelEdit} submitProject={createNewProject} />
    </CreateBox>
  );
}

const CreateBox = styled.div`
  padding: 40px;
  border-radius: inherit;
  padding: 40px;
  background: #f7f9f1;
  border: 4px solid #333333;

  & .title {
    display: flex;
    align-items: center;
    gap: 20px;
    & > h3 {
      margin: 0;
      display: inline;
      font-size: 36px;
      line-height: 40px;
      color: #333333;
    }
  }
`;
