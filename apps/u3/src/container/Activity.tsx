import styled from 'styled-components';
import CardBase from '../components/common/card/CardBase';
import PageTitle from '../components/common/PageTitle';
import Rss3Content from '../components/fren/Rss3Content';
import { CurrencyETH } from '../components/icons/currency-eth';
import { MainWrapper } from '../components/layout/Index';

function Activity() {
  return (
    <Wrapper>
      <PageTitle>Activity</PageTitle>
      <ContentWrapper>
        <Rss3Content
          address={['0x74667801993b457b8ccf19d03bbbaa52b7fff43b']}
          empty={<NoActivity />}
        />
      </ContentWrapper>
    </Wrapper>
  );
}
export default Activity;
export function NoActivity() {
  return (
    <div className="no-item">
      <CurrencyETH />
      <p>No transactions found on Ethereum.</p>
    </div>
  );
}
const Wrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ContentWrapper = styled(CardBase)`
  flex: 1;
  & .no-item {
    box-sizing: border-box;
    text-align: center;
    height: fit-content;
    background: #1b1e23;
    border-radius: 20px;
    padding: 40px 0 40px 0;
    flex-grow: 1;
    & p {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;

      color: #748094;
    }
  }

  & .activity {
    &:last-child {
      border-bottom: none;
    }

    & .info {
      display: flex;
      gap: 10px;
      flex-direction: column;
      > div {
        display: flex;
        gap: 10px;
      }
      & p {
        margin: 0;
      }

      & p.quote {
        padding: 10px 20px;
        gap: 10px;
        background: #14171a;
        border-radius: 10px;
      }
      & .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div {
          display: flex;
          gap: 10px;
          align-items: center;
          & span {
            font-weight: 400;
            font-size: 14px;
            line-height: 17px;
            color: #718096;
          }
          & .nickname {
            font-weight: 500;
            font-size: 16px;
            line-height: 19px;
          }
        }
      }

      & .intro {
        display: flex;
        align-items: center;

        font-weight: 400;
        font-size: 14px;
        line-height: 17px;

        color: #718096;
      }

      & .source {
        display: flex;
        padding: 8px 20px 8px 16px;
        box-sizing: border-box;
        gap: 8px;
        height: 40px;
        width: fit-content;
        background: #1a1e23;
        border: 1px solid #39424c;
        border-radius: 100px;
        > img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
      }
    }
  }
`;
