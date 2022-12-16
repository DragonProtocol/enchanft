import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import Badge from '../contents/Badge';
import { EventExploreListItemResponse } from '../../services/types/event';

export default function RecommendEvents({
  data,
  viewAllAction,
}: {
  data: EventExploreListItemResponse[];
  viewAllAction: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Box>
      <Title text="Recommended Events" viewAllAction={viewAllAction} />{' '}
      <div className="lists">
        {data.map((item) => {
          return (
            <Card
              clickAction={() => {
                navigate(`/events/${item.uid || item.id}`);
              }}
              key={item.uid || item.id}
              title={item.name}
              img={item.image}
              author={item.project.name || ''}
            />
          );
        })}
      </div>
    </Box>
  );
}

const Box = styled.div`
  & .lists {
    display: flex;
    gap: 40px;
    margin-top: 20px;
  }
`;

function Card({
  title,
  img,
  author,
  clickAction,
}: {
  title: string;
  img: string;
  author: string;
  clickAction: () => void;
}) {
  return (
    <CardBox onClick={clickAction}>
      <img src={img} alt="" />
      <div>
        <h2>{title}</h2>
        <div>
          <Badge text="Badge" />
          <span>{author}</span>
        </div>
      </div>
    </CardBox>
  );
}

const CardBox = styled.div`
  width: 260px;
  height: 371px;
  cursor: pointer;
  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;

  > img {
    width: 260px;
    height: 260px;
  }

  > div {
    padding: 20px;
    h2 {
      margin: 0;
      margin-bottom: 10px;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;

      color: #ffffff;
    }

    > div {
      display: flex;
      gap: 10px;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;

      color: #718096;
    }
  }
`;
