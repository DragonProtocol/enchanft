import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Platform } from '../../../services/types/common';
import { NooxData } from '../../../services/types/profile';
import { NoItem, NooxCard } from './Card';
import Title from './Title';

export default function Noox({ data }: { data: NooxData }) {
  const [expand, setExpand] = useState(true);
  const navigate = useNavigate();
  return (
    <ContentBox>
      <Title
        name={(data.total && `NOOX(${data.total})`) || `NOOX`}
        expand={expand}
        setExpand={(e) => setExpand(e)}
        exploreAction={() => {
          navigate(`/events?platform=${Platform.NOOX}`);
        }}
      />
      {expand && (
        <div className="data">
          {(data.result.length &&
            data.result.map((item) => {
              return (
                <NooxCard
                  key={item.transaction_hash}
                  data={item}
                  oatAction={() => {
                    navigate('/events');
                  }}
                />
              );
            })) || (
            <NoItem
              msg="No data were found on Noox. Explore and get the first one."
              exploreAction={() => {
                navigate(`/events?platform=${Platform.NOOX}`);
              }}
            />
          )}
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
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
    /* height: 258px; */
  }
`;
