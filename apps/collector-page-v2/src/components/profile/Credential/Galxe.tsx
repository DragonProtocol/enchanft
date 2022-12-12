import { useState } from 'react';
import styled from 'styled-components';
import { GalxeCard } from './Card';

import { GalxeData } from '../../../services/types/profile';
import Title from './Title';

export default function Galxe({ data }: { data: GalxeData }) {
  const [expand, setExpand] = useState(true);
  return (
    <ContentBox>
      <Title
        name={`Galxe(${data.addressInfo.nfts.totalCount})`}
        expand={expand}
        setExpand={(e) => setExpand(e)}
        exploreAction={() => {}}
      />
      {expand && (
        <div className="data">
          {data.addressInfo.nfts.list.map((item) => {
            return <GalxeCard key={item.id} data={item} />;
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
