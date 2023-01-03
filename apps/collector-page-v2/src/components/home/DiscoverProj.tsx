import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import { Subtract } from '../icons/subtract';
import { ProjectExploreListItemResponse } from '../../services/types/project';

export default function DiscoverProj({
  data,
  viewAllAction,
}: {
  data: Array<ProjectExploreListItemResponse>;
  viewAllAction: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Box>
      <Title text="Discover Projects" viewAllAction={viewAllAction} />{' '}
      <div className="lists">
        {data.map((item) => {
          return (
            <Card
              clickAction={() => {
                navigate(`/projects/${item.id}`);
              }}
              key={item.id}
              {...item}
              events={item.events || []}
              contents={item.contents || []}
            />
          );
        })}
      </div>
    </Box>
  );
}

const Box = styled.div`
  width: 100%;

  & .lists {
    margin-top: 20px;
    background: #1b1e23;
    border-radius: 20px;
  }
`;

function Card({
  name,
  image,
  events,
  contents,
  clickAction,
}: {
  name: string;
  image: string;
  events: any[];
  contents: any[];
  clickAction: () => void;
}) {
  return (
    <CardBox onClick={clickAction}>
      <img src={image} alt="" />
      <div>
        <div>
          <h3>{name}</h3>
          <span>{/* <Subtract /> */}</span>
        </div>
        <div>
          <span>{events.length} events</span>
          <span>{contents.length} content</span>
        </div>
      </div>
    </CardBox>
  );
}

const CardBox = styled.div`
  display: flex;
  padding: 20px;
  gap: 10px;
  cursor: pointer;
  height: 88px;
  border-bottom: 1px solid rgba(57, 66, 76, 0.5);
  &:last-child {
    border: none;
  }
  box-sizing: border-box;
  & > img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
  & > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    > div {
      display: flex;
      h3 {
        margin: 0;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        margin-right: 5px;
        color: #ffffff;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &:last-child {
        gap: 20px;
        font-weight: 400;
        font-size: 16px;
        line-height: 19px;

        color: #718096;
      }
    }
  }
`;
