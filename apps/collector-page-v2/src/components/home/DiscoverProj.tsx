import styled from 'styled-components';
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
  return (
    <Box>
      <Title text="Discover Projects" viewAllAction={viewAllAction} />{' '}
      <div className="lists">
        {data.map((item) => {
          return (
            <Card
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
  width: 358px;

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
}: {
  name: string;
  image: string;
  events: any[];
  contents: any[];
}) {
  return (
    <CardBox>
      <img src={image} alt="" />
      <div>
        <div>
          <h3>{name}</h3>
          <span>
            <Subtract />
          </span>
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

  height: 88px;
  border-bottom: 1px solid #14171a;
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
