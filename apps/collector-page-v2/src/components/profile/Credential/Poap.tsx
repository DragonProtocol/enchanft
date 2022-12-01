import { useState } from 'react';
import styled from 'styled-components';
import { CircleCard } from './Card';

import Title from './Title';

export default function Poap() {
  const [expand, setExpand] = useState(true);
  return (
    <ContentBox>
      <Title
        name="POAP"
        expand={expand}
        setExpand={(e) => setExpand(e)}
        exploreAction={() => {}}
      />
      {expand && (
        <div className="data">
          <CircleCard />
          <CircleCard />
          <CircleCard />
          <CircleCard />
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
