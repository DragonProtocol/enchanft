import { selectProjectDetail } from '../redux/projectSlice';
import { useAppSelector } from '../redux/store';
import ProjectInfo from '../Components/ProjectInfo';
import MintInfo from '../Components/MintInfo';
import styled from 'styled-components';

import Loading from '../Components/Loading';
import { useParams } from 'react-router-dom';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project } = useAppSelector(selectProjectDetail);

  if (project?.slug !== slug) return <Loading />;
  if (!project) return null;
  return (
    <DetailBox>
      <ProjectInfo project={project} />
      <MintInfo project={project} />
    </DetailBox>
  );
}

const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  > div {
    border-radius: inherit;
    padding: 40px;
    background: #f7f9f1;
    border: 4px solid #333333;
  }

  & .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > h3 {
      margin: 0;
      font-weight: 700;
      font-size: 24px;
      line-height: 36px;
      color: #333333;
    }

    > button {
      padding: 10px 18px;
      height: 48px;
      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #ffffff;
    }
  }
`;
