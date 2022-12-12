import { useState } from 'react';
import styled from 'styled-components';
import { NooxData } from '../../../services/types/profile';
import { NooxCard } from './Card';
import Title from './Title';

export default function Noox({ data }: { data: NooxData }) {
  const [expand, setExpand] = useState(true);
  return (
    <ContentBox>
      <Title
        name={`NOOX(${data.total})`}
        expand={expand}
        setExpand={(e) => setExpand(e)}
        exploreAction={() => {}}
      />
      {expand && (
        <div className="data">
          {data.result.map((item) => {
            return <NooxCard key={item.transaction_hash} data={item} />;
          })}
        </div>
      )}
    </ContentBox>
  );
}

const ContentBox = styled.div`
  margin-top: 40px;
  background: #1b1e23;
  border-radius: 20px;
  padding: 20px;
  .data {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    /* height: 258px; */
  }
`;
