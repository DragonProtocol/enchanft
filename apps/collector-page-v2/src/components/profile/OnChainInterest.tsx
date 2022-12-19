import { BigNumber, ethers } from 'ethers';
import { useMemo } from 'react';
import styled from 'styled-components';
import {
  ERC20Balances,
  NFTData,
  NFTDataListItem,
} from '../../services/types/profile';

import CrownImg from '../imgs/crown.svg';
import ethImage from '../imgs/eth.png';

export default function OnChainInterest({
  data,
  wallet,
  ethBalance,
}: {
  data: NFTData;
  wallet: ERC20Balances;
  ethBalance: string;
}) {
  return (
    <ContentBox>
      <div className="nft">
        <div className="title">
          <span>{`NFT(${data.result.length})`}</span>
          <div>
            <select title="filter" name="all" id="">
              <option value="all">all</option>
            </select>
          </div>
        </div>
        <div className="data">
          {data.result.map((item) => {
            return <NFTCard key={item.normalized_metadata.name} data={item} />;
          })}
        </div>
      </div>
      <div className="wallet">
        <h2>Wallet</h2>
        <div>
          <EthTokenInfo balance={ethBalance} />
          {wallet.map((item) => {
            return (
              <TokenInfo
                key={item.name}
                img={item.logo}
                name={item.name}
                symbol={item.symbol}
                balance={item.balance}
                decimals={item.decimals}
              />
            );
          })}
        </div>
      </div>
    </ContentBox>
  );
}

function EthTokenInfo({ balance }: { balance: string }) {
  return (
    <TokenInfoBox>
      <div>
        <img src={ethImage} alt="" />
        <div>
          <h3>ETH</h3>
          <span>Ether</span>
        </div>
      </div>
      <span>{ethers.utils.formatEther(balance).substring(0, 4)}</span>
    </TokenInfoBox>
  );
}

function TokenInfo(props: {
  img: string;
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
}) {
  const { img, symbol, name, balance, decimals } = props;
  return (
    <TokenInfoBox>
      <div>
        <img src={img} alt="" />
        <div>
          <h3>{symbol}</h3>
          <span>{name}</span>
        </div>
      </div>
      <span>
        {BigNumber.from(balance)
          .div(BigNumber.from(`1${'0'.repeat(decimals)}`))
          .toNumber()
          .toFixed(2)}
      </span>
    </TokenInfoBox>
  );
}

const TokenInfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;

  border-bottom: 1px solid #14171a;
  > div {
    display: flex;
    gap: 10px;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    h3 {
      margin: 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #ffffff;
    }

    span {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      /* identical to box height */

      /* #718096 */

      color: #718096;
    }
  }
  img {
    width: 48px;
    border-radius: 50%;
  }

  > span {
    margin: 0;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    text-align: right;

    /* #FFFFFF */

    color: #ffffff;
  }
`;

function NFTCard({ data }: { data: NFTDataListItem }) {
  const img = useMemo(() => {
    if (data?.normalized_metadata?.image) {
      return data?.normalized_metadata.image.replace(
        'ipfs://',
        'https://ipfs.io/ipfs/'
      );
    }
    return '';
  }, [data?.normalized_metadata.image]);
  return (
    <CardBox>
      <img src={img} alt="" />
      <div>
        <p>{data?.normalized_metadata.name}</p>
        {/* {data?.normalized_metadata.name} */}
        {/* <h3>2.99 SOL</h3> */}
      </div>
    </CardBox>
  );
}

const CardBox = styled.div`
  width: 165px;
  height: 225px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid #39424c;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  img {
    width: 100%;
    aspect-ratio: 1;
  }

  & > div {
    padding: 20px;
    > p {
      margin: 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      overflow: hidden;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #ffffff;
    }
  }
`;

const ContentBox = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 40px;
  .nft {
    flex-grow: 1;
    width: 760px;
    padding: 30px 20px;
    background: #1b1e23;
    border-radius: 20px;
    box-sizing: border-box;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span {
        font-style: italic;
        font-weight: 700;
        font-size: 24px;
        line-height: 28px;

        color: #ffffff;
      }
      > div {
        /* TODO */
        input {
          width: 100%;
          box-sizing: border-box;
        }
      }
      & select {
        outline: none;
        width: 300px;
        height: 48px;
        background: #1a1e23;
        border: 1px solid #39424c;
        border-radius: 12px;
        color: #ffffff;
        padding: 0 5px;
        appearance: none;
        background-image: url(${CrownImg});
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1em;
      }
    }
    .data {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
  }

  .wallet {
    width: 360px;
    box-sizing: border-box;

    background: #1b1e23;
    border-radius: 20px;
    height: fit-content;
    & h2 {
      padding: 20px;
      margin: 0;
      font-style: italic;
      font-weight: 700;
      font-size: 24px;
      line-height: 28px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #14171a;

      color: #ffffff;
    }

    > div {
      > div {
        padding: 0 20px;
      }
    }
  }
`;
