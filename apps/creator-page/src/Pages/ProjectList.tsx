import styled from 'styled-components';
import { SearchBar } from '../Components/SearchBar';
import { AddCard, ItemCard } from '../Components/ProjectCard';
import { useNavigate } from 'react-router-dom';

export default function ProjectList() {
  const navigation = useNavigate();
  return (
    <ListBox>
      <div className="title">
        <h3>Project List</h3>
        <SearchBar search={(text) => {}} />
      </div>
      <div className="list">
        <AddCard
          addAction={() => {
            navigation('/community/new');
          }}
        />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </div>
    </ListBox>
  );
}

const ListBox = styled.div`
  padding: 20px;
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
