import { UserAvatar } from '@ecnft/wl-user-react';
import { useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import Badge from '../contents/Badge';
import { Copy } from '../icons/copy';
import { CurrencyETH } from '../icons/currency-eth';
import { GasPump } from '../icons/gas-pump';
import Karma from '../common/Karma';

export default function Activities() {
  const [list, setList] = useState([{ id: 1 }, { id: 2 }]);
  if (list.length === 0) {
    return <NoActivities />;
  }
  return (
    <ContentBox>
      <div className="lists">
        {list.map((item, idx) => {
          return <ActivityItem key={item.id} {...item} />;
        })}
      </div>
      <div className="u-karma">
        <div className="u-karma-item title">U Karma</div>
        <div className="u-karma-item">
          <div>
            <Karma score="1234" />
            <span>{dayjs('1999-01-01').fromNow()}</span>
          </div>
          <div>GM have a nice day in U3</div>
        </div>
        <div className="u-karma-item">u karma</div>
      </div>
    </ContentBox>
  );
}

export function NoActivities() {
  return (
    <ContentBox>
      <div className="no-item">
        <CurrencyETH />
        <p>No transactions found on Ethereum.</p>
      </div>
    </ContentBox>
  );
}

function ActivityItem({ id }: { id: number }) {
  return (
    <ActivityBox className="activity">
      <ActivityAvatar />
      <div className="info">
        <div className="header">
          <div>
            <span className="nickname">Nicole</span>
            <span>fas...df</span>
            <span
              onClick={() => {
                // TODO
              }}
            >
              <Copy />
            </span>
          </div>
          <div>
            <GasPump /> gasFee
          </div>
        </div>
        <div className="intro">
          <Badge text="Badge" />
          <span>fasdfasf</span> | <span>{dayjs('1999-01-01').fromNow()}</span>
        </div>
        <p className="contents">
          I am afraid looking how things are we are going towards this direction
        </p>
        <p className="quote">
          A Cosmos app chain that honors Apples 30% fee on gas at the protocol
          level... Its called iChain. DM me if you want access to the 🍏Seed
          round... 😉
        </p>
        <div className="source">
          <img
            src="https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk"
            alt=""
          />
          Opensea
        </div>
      </div>
    </ActivityBox>
  );
}

const ContentBox = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 40px;

  & .no-item {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    padding: 40px 20px;
    height: 219px;
    background: #1b1e23;
    border-radius: 20px;
    & p {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;

      color: #748094;
    }
  }

  & .u-karma {
    min-width: 360px;
    width: 360px;
    background: #1b1e23;
    border-radius: 20px;
    height: fit-content;
    color: #ffffff;

    & .u-karma-item {
      padding: 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #14171a;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      > div {
        &:first-child {
          display: flex;
          justify-content: space-between;
        }
      }

      &.title {
        font-weight: 700;
        font-size: 24px;
        line-height: 28px;
        font-style: italic;
      }
    }
  }
  & .lists {
    background: #1b1e23;
    border-radius: 20px;
    padding: 0 20px;
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

const ActivityBox = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #39424c;
  color: #ffffff;
`;

const ActivityAvatar = styled(UserAvatar)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;
