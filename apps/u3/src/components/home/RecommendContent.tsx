import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Badge from '../contents/Badge';
import { ContentListItem } from '../contents/ContentList';
import LinkBox from '../contents/LinkBox';

import Title from './Title';

export default function RecommendContent({
  data,
  viewAllAction,
}: {
  data: Array<ContentListItem & { recReason: string }>;
  viewAllAction: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Box>
      <Title text="Recommended Contents" viewAllAction={viewAllAction} />
      <div className="lists">
        {data.map((item) => {
          return (
            <Card
              clickAction={() => {
                navigate(`/contents/${item.id}`);
              }}
              key={item.id || item.title}
              {...item}
              upVoteNum={item.upVoteNum || 0 + item.editorScore || 0}
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

function Card({
  title,
  upVoteNum,
  clickAction,
  link,
  type,
  recReason,
}: {
  title: string;
  upVoteNum: number;
  clickAction: () => void;
  link: string;
  type: string;
  recReason: string;
}) {
  const linkSplitAry = link.split('/');
  const contentImgUrl = `${linkSplitAry[0]}//${linkSplitAry[2]}/favicon.ico`;
  return (
    <CardWrapper>
      <CardBox onClick={clickAction}>
        <ContentImg
          src={contentImgUrl}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <CardRight>
          <ContentTitle>{title}</ContentTitle>
          <RightRow>
            {type && <Badge text={type} />}
            <ContentVote>👏 &nbsp;{upVoteNum}</ContentVote>
            <RightRowLine />
            <ContentLink text={link} />
          </RightRow>
          <ContentRecReason>{recReason}</ContentRecReason>
        </CardRight>
      </CardBox>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  flex: 50%;
  box-sizing: border-box;
  padding: 20px;
  height: 120px;
  border-top: 1px solid #39424c;
  cursor: pointer;
  overflow: hidden;
  &:nth-child(1) {
    border-top: none;
  }
  &:nth-child(2) {
    border-top: none;
  }
  &:nth-child(even) {
    border-left: 1px solid #39424c;
  }
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const CardBox = styled.div`
  height: 100%;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ContentImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;
const CardRight = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const RightRow = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
`;
const ContentTitle = styled.div`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;

  overflow: hidden;

  text-overflow: ellipsis;

  display: -webkit-box;

  -webkit-box-orient: vertical;

  -webkit-line-clamp: 1;
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
const RightRowLine = styled.div`
  width: 1px;
  height: 10px;
  background: #718096;
`;
