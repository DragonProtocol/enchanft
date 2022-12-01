import React from 'react';
import styled from 'styled-components';

const DailyDigestBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  min-width: 500px;
  h2 {
    margin: 0;
  }
`;

export default function DailyDigest() {
  return (
    <DailyDigestBox>
      <div>
        <h2>Daily Digest</h2>
        <div>Daily recommends everything you are interested web3</div>
      </div>
      <div>
        <button type="button">email</button>
      </div>
    </DailyDigestBox>
  );
}
