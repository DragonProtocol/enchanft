import { BigNumber, ethers } from 'ethers';
import { useMemo } from 'react';
import styled from 'styled-components';
import {
  ERC20Balances,
  NFTData,
  NFTDataListItem,
} from '../../services/types/profile';

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
            <input title="search" type="text" />
          </div>
        </div>
        <div className="data">
          {data.result.map((item) => {
            return <NFTCard key={item.normalized_metadata.name} data={item} />;
          })}
        </div>
      </div>
      <div className="wallet">
        <div>Wallet</div>
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
        <img
          src="https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk"
          alt=""
        />
        <div>
          <h3>ETH</h3>
          <span>Ether</span>
        </div>
      </div>
      <span>{ethers.utils.formatEther(balance).substring(0, 7)}</span>
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
          .toString()}
      </span>
    </TokenInfoBox>
  );
}

const TokenInfoBox = styled.div`
  border: 1px solid gray;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > div {
    display: flex;
    gap: 10px;
    h3 {
      margin: 0;
    }
  }
  img {
    width: 50px;
  }

  > span {
    margin: 0;
    font-weight: 700;
  }
`;

function NFTCard({ data }: { data: NFTDataListItem }) {
  const img = useMemo(() => {
    return data?.normalized_metadata.image.replace(
      'ipfs://',
      'https://ipfs.io/ipfs/'
    );
  }, [data?.normalized_metadata.image]);
  return (
    <CardBox>
      <img src={img} alt="" />
      <div>
        <h3>{data?.normalized_metadata.name}</h3>
        {/* <h3>2.99 SOL</h3> */}
      </div>
    </CardBox>
  );
}

const CardBox = styled.div`
  width: 200px;
  border: 1px solid gray;
  position: relative;
  img {
    width: 100%;
  }

  h3 {
    margin: 0;
  }
`;

const ContentBox = styled.div`
  display: flex;
  gap: 20px;
  .nft {
    flex-grow: 1;
    .title {
      display: flex;
      gap: 100px;
      > div {
        flex-grow: 1;
        input {
          width: 100%;
          box-sizing: border-box;
        }
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
    min-width: 500px;
  }
`;
