import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import Badge from '../contents/Badge';
import { EventExploreListItemResponse } from '../../services/types/event';
import isUrl from '../../utils/isUrl';
import { MEDIA_BREAK_POINTS } from '../../constants';
import RewardTag from '../event/RewardTag';
import { Reward } from '../../services/types/common';

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
          const { image, project, platform } = item;
          const img = isUrl(image)
            ? image
            : isUrl(project?.image)
            ? project.image
            : isUrl(platform?.logo)
            ? platform.logo
            : '';
          return (
            <Card
              clickAction={() => {
                navigate(`/events/${item.uid || item.id}`);
              }}
              key={item.uid || item.id}
              title={item.name}
              img={img}
              author={item?.recReason || item?.project?.name || ''}
              reward={item.reward}
            />
          );
        })}
      </div>
    </Box>
  );
}

const Box = styled.div`
  & .lists {
    margin-top: 20px;
    width: 100%;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(4, minmax(240px, 1fr));
    /* @media (min-width: ${MEDIA_BREAK_POINTS.xl}px) {
      grid-template-columns: repeat(4, minmax(240px, 1fr));
    }
    @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
      grid-template-columns: repeat(3, minmax(240px, 1fr));
    }
    @media (min-width: ${MEDIA_BREAK_POINTS.sm}px) and (max-width: ${MEDIA_BREAK_POINTS.md}px) {
      grid-template-columns: repeat(2, minmax(240px, 1fr));
    }
    @media (max-width: ${MEDIA_BREAK_POINTS.sm}px) {
      display: flex;
      flex-direction: column;
      grid-gap: 20px;
    } */
  }
`;

function Card({
  title,
  img,
  author,
  reward,
  clickAction,
}: {
  title: string;
  img: string;
  author: string;
  reward: Reward;
  clickAction: () => void;
}) {
  return (
    <CardWrapper>
      <CardBox onClick={clickAction}>
        <LeftBox>
          <EventTitle>{title}</EventTitle>
          <EventAuthor>{author}</EventAuthor>
          <EventRewardTagBox>
            <RewardTag value={reward} />
          </EventRewardTagBox>
        </LeftBox>
        <RightBox>
          <EventImg src={img} />
        </RightBox>
      </CardBox>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  width: 100%;
  height: 110px;
  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const CardBox = styled.div`
  transition: all 0.3s;
  display: flex;
`;
const LeftBox = styled.div`
  flex: 1;
  padding: 14px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: space-between;
`;
const RightBox = styled.div`
  width: 110px;
  height: 110px;
  flex-shrink: 0;
`;
const EventImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const EventTitle = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  overflow: hidden;

  text-overflow: ellipsis;

  display: -webkit-box;

  -webkit-box-orient: vertical;

  -webkit-line-clamp: 2;
`;
const EventAuthor = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;

  background: linear-gradient(to right, #cd62ff, #62aaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;
const EventRewardTagBox = styled.div`
  div {
    width: fit-content;
  }
`;