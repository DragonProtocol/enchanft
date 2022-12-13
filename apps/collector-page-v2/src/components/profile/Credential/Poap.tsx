import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PoapData } from '../../../services/types/profile';
import { PoapCard } from './Card';

import Title from './Title';

export default function Poap({ data }: { data: Array<PoapData> }) {
  const [expand, setExpand] = useState(true);
  const navigate = useNavigate();
  return (
    <ContentBox>
      <Title
        name={`POAP(${data.length})`}
        expand={expand}
        setExpand={(e) => setExpand(e)}
        exploreAction={() => {
          navigate('/events');
        }}
      />
      {expand && (
        <div className="data">
          {data.map((item) => {
            return (
              <PoapCard
                key={item.event.id}
                data={item}
                oatAction={() => {
                  navigate('/events');
                }}
              />
            );
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
