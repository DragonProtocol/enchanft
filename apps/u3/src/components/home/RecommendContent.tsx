import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CardBase from '../common/card/CardBase';
import EllipsisText from '../common/text/EllipsisText';
import Badge from '../contents/Badge';
import { ContentListItem } from '../contents/ContentList';
import LinkBox from '../contents/LinkBox';

import Title from './Title';

export default function RecommendContent({
  data,
  viewAllAction,
}: {
  data: Array<ContentListItem & { recReason?: string }>;
  viewAllAction: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Box>
      <Title text="Recommended Contents" viewAllAction={viewAllAction} />
      <CardsLayout>
        {data.map((item) => {
          return (
            <Card
              clickAction={() => {
                navigate(`/contents/${item.id}`);
              }}
              key={item.id || item.title}
              data={item}
            />
          );
        })}
      </CardsLayout>
    </Box>
  );
}

const Box = styled.div`
  width: 100%;
`;
const CardsLayout = styled(CardBase)`
  margin-top: 20px;
  height: 534px;
  display: grid;
  grid-gap: 20px;
  grid-auto-columns: auto;
  grid-auto-rows: auto;
`;
function Card({
  data: { title, upVoteNum, editorScore, link, type, recReason },
  clickAction,
}: {
  data: {
    title: string;
    upVoteNum: number;
    editorScore?: number;
    link: string;
    type: string;
    recReason?: string;
  };
  clickAction: () => void;
}) {
  const linkSplitAry = link.split('/');
  const platformImgUrl = `${linkSplitAry[0]}//${linkSplitAry[2]}/favicon.ico`;
  return (
    <CardWrapper className="card-wraper">
      <CardBody onClick={clickAction} className="card-body">
        <ContentTitle className="title">{title}</ContentTitle>
        <CardBottom>
          <BottomRow>
            {type && <Badge text={type} />}
            <ContentVote>
              👏 &nbsp;{(upVoteNum ?? 0) + (editorScore ?? 0)}
            </ContentVote>
            <BottomRowLine />
            <ContentLink text={link} />
          </BottomRow>
          <BottomRow>
            <ContentRecReason>{recReason}</ContentRecReason>
            <PlatformImg
              src={platformImgUrl}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </BottomRow>
        </CardBottom>
      </CardBody>
    </CardWrapper>
  );
}

const CardWrapper = styled(CardBase)`
  cursor: pointer;
  overflow: hidden;
  &:nth-child(1) {
    grid-column-start: 1;
    grid-column-end: 4;
    grid-row-start: 1;
    grid-row-end: 3;
    .title {
      font-size: 40px;
      line-height: 47px;
      -webkit-line-clamp: 3;
    }
  }
  &:nth-child(2) {
    grid-row-start: 1;
    grid-row-end: 2;
  }
  &:nth-child(3) {
    grid-row-start: 2;
    grid-row-end: 3;
  }
  &:nth-child(2),
  &:nth-child(3) {
    grid-column-start: 4;
    grid-column-end: 7;
    .card-body {
      gap: 10px;
    }
    .title {
      font-size: 24px;
      line-height: 24px;
      -webkit-line-clamp: 2;
    }
  }

  &:nth-child(4) {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  &:nth-child(5) {
    grid-column-start: 3;
    grid-column-end: 5;
  }
  &:nth-child(6) {
    grid-column-start: 5;
    grid-column-end: 7;
  }
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    grid-row-start: 3;
    grid-row-end: 4;
    .title {
      font-size: 18px;
      line-height: 20px;
      -webkit-line-clamp: 2;
    }
  }
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const CardBody = styled.div`
  height: 100%;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`;
const ContentTitle = styled(EllipsisText)`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const CardBottom = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
`;
const BottomRow = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ContentLink = styled(LinkBox)`
  width: 0;
  flex: 1;
`;
const ContentVote = styled.div`
  flex-shrink: 0;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  color: #ffffff;
`;
const ContentRecReason = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;
const BottomRowLine = styled.div`
  width: 1px;
  height: 10px;
  background: #718096;
`;
const PlatformImg = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-left: auto;
`;
