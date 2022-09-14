import styled from 'styled-components';
import { Box } from './Box';
export default function TotalSupply() {
  return (
    <ContentBox>
      <h4>Total Supply</h4>
      <div className="area">
        <span>60000</span>
      </div>
    </ContentBox>
  );
}

const ContentBox = styled(Box)`
  & .area {
    display: flex;
    align-items: center;
    height: 50px;

    & span {
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
      color: #333333;
    }
  }
`;
