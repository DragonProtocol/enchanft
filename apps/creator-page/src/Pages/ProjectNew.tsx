import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BackBtn from '../Components/BackBtn';
import CommunityCreate from '../Components/ProjectCreate';

export default function ProjectNew() {
  const navigation = useNavigate();
  return (
    <CreateBox>
      <div className="title">
        <BackBtn
          clickAction={() => {
            navigation(-1);
          }}
        />
        <h3>Create a New Project</h3>
      </div>
      <CommunityCreate />
    </CreateBox>
  );
}

const CreateBox = styled.div`
  padding: 40px;

  & .title {
    display: flex;
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
