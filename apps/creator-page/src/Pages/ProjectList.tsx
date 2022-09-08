import styled from 'styled-components';
import { SearchBar } from '../Components/SearchBar';
import { AddCard, ItemCard } from '../Components/ProjectCard';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../redux/store';
import { selectProjectList } from '../redux/projectListSlice';
import Loading from '../Components/Loading';
import { AsyncRequestStatus } from '../api';

export default function ProjectList() {
  const navigation = useNavigate();
  const { data: projectList, status } = useAppSelector(selectProjectList);

  if (status !== AsyncRequestStatus.FULFILLED) {
    return <Loading />;
  }

  return (
    <ListBox>
      <div className="title">
        <h3>Project List</h3>
        <SearchBar search={(text) => {}} />
      </div>
      <div className="list">
        <AddCard
          addAction={() => {
            navigation('/project/new');
          }}
        />
        {projectList?.map((item) => {
          return <ItemCard key={item.id} project={item} />;
        })}
      </div>
    </ListBox>
  );
}

const LoadingBox = styled.div`
  text-align: center;
  padding-top: 100px;
  & img {
    width: 100px;
  }
`;

const ListBox = styled.div`
  padding: 20px;
  background: #f7f9f1;
  border: 4px solid #333333;
  & .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > h3 {
      margin: 0;
      font-weight: 700;
      font-size: 20px;
      line-height: 30px;
      color: #333333;
    }
  }

  & .list {
    margin-top: 20px;
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;
