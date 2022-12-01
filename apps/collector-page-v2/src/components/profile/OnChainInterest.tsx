import styled from 'styled-components';

export default function OnChainInterest() {
  return (
    <ContentBox>
      <div className="nft">
        <div className="title">
          <span>NFT(4)</span>
          <div>
            <input title="search" type="text" />
          </div>
        </div>
        <div className="data">
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
          <NFTCard />
        </div>
      </div>
      <div className="wallet">
        <div>Wallet</div>
        <div>
          <TokenInfo />
          <TokenInfo />
          <TokenInfo />
          <TokenInfo />
        </div>
      </div>
    </ContentBox>
  );
}

function TokenInfo() {
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
      <span>0.23</span>
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

function NFTCard() {
  return (
    <CardBox>
      <img
        src="https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk"
        alt=""
      />
      <div>
        <h3>Monkey</h3>
        <h3>2.99 SOL</h3>
      </div>
    </CardBox>
  );
}

const CardBox = styled.div`
  width: 120px;
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
