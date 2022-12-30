import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { GalxeCard, NoItem } from './Card';

import { GalxeData } from '../../../services/types/profile';
import { Platform } from '../../../services/types/common';
import Title from './Title';

export default function Galxe({ data }: { data: GalxeData }) {
  const [expand, setExpand] = useState(true);
  const navigate = useNavigate();

  return (
    <ContentBox>
      <Title
        name={
          (data.addressInfo?.nfts.totalCount &&
            `Galxe(${data.addressInfo.nfts.totalCount})`) ||
          `Galxe`
        }
        expand={expand}
        setExpand={(e) => setExpand(e)}
        exploreAction={() => {
          navigate(`/events?platform=${Platform.GALXE}`);
        }}
      />
      {expand && (
        <div className="data">
          {(data.addressInfo?.nfts.list.length &&
            data.addressInfo?.nfts.list.map((item) => {
              return (
                <GalxeCard
                  key={item.id}
                  data={item}
                  oatAction={() => {
                    navigate('/events');
                  }}
                />
              );
            })) || (
            <NoItem
              msg="No OATs were found on Galxe. Explore and get the first one."
              exploreAction={() => {
                navigate(`/events?platform=${Platform.GALXE}`);
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
