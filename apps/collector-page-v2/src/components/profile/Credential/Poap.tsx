import { useState } from 'react';
import styled from 'styled-components';

import { PoapData } from '../../../services/types/profile';
import { PoapCard } from './Card';

import Title from './Title';

export default function Poap({ data }: { data: Array<PoapData> }) {
  const [expand, setExpand] = useState(true);
  return (
    <ContentBox>
      <Title
        name={`POAP(${data.length})`}
        expand={expand}
        setExpand={(e) => setExpand(e)}
        exploreAction={() => {}}
      />
      {expand && (
        <div className="data">
          {data.map((item) => {
            return <PoapCard key={item.event.id} data={item} />;
          })}
        </div>
      )}
    </ContentBox>
  );
}

const ContentBox = styled.div`
  .data {
    margin-top: 10px;
    padding-top: 10px;
    display: flex;
    gap: 20px;
  }
`;
