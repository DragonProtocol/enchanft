import { useState } from 'react';
import styled from 'styled-components';
import { Card } from './Card';

import Title from './Title';

export default function Noox() {
  const [expand, setExpand] = useState(true);
  return (
    <ContentBox>
      <Title
        name="Noox"
        expand={expand}
        setExpand={(e) => setExpand(e)}
        exploreAction={() => {}}
      />
      {expand && (
        <div className="data">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
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
