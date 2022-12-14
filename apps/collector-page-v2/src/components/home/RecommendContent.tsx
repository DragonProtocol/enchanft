import styled from 'styled-components';
import Badge from '../contents/Badge';

import Title from './Title';

export default function RecommendContent({
  data,
  viewAllAction,
}: {
  data: any[];
  viewAllAction: () => void;
}) {
  return (
    <Box>
      <Title text="Recommended Contents" viewAllAction={viewAllAction} />
      <div className="lists">
        {data.map((item) => {
          return (
            <Card
              key={item.uid || item.title}
              {...item}
              author={item.requirements[0]?.community?.title || ''}
            />
          );
        })}
      </div>
    </Box>
  );
}

const Box = styled.div`
  width: 760px;

  & .lists {
    margin-top: 20px;
    background: #1b1e23;
    border-radius: 20px;
  }
`;

function Card({ title, author }: { title: string; author: string }) {
  return (
    <CardBox>
      <h2>{title}</h2>
      <div>
        <Badge text="DeFi" />
        <span>{author}</span>
      </div>
    </CardBox>
  );
}

const CardBox = styled.div`
  box-sizing: border-box;
  padding: 20px;
  height: 88px;
  border-bottom: 1px solid #14171a;
  & h2 {
    margin: 0;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
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
