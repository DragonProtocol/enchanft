import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Badge from '../contents/Badge';
import { ContentListItem } from '../contents/ContentList';

import Title from './Title';

export default function RecommendContent({
  data,
  viewAllAction,
}: {
  data: ContentListItem[];
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
              author={item.author || ''}
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
  author,
  clickAction,
}: {
  title: string;
  author: string;
  clickAction: () => void;
}) {
  return (
    <CardWrapper>
      <CardBox onClick={clickAction}>
        <h2>{title}</h2>
        <div>
          <Badge text="DeFi" />
          <span>{author}</span>
        </div>
      </CardBox>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  flex: 50%;
  box-sizing: border-box;
  padding: 20px;
  height: 88px;
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
      transform: scale(1.1);
    }
  }
`;
const CardBox = styled.div`
  transform-origin: left center;
  transition: all 0.3s;

  & h2 {
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
  }
  > div {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    /* identical to box height */

    /* #718096 */

    color: #718096;
    & span {
    }
  }
`;
