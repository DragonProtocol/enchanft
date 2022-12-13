import styled from 'styled-components';
import CarouselBg from '../imgs/carousel-bg.png';
import MagicCubeImg from '../imgs/magic-cube.png';

export default function Carousel() {
  return (
    <Box>
      <div className="info">
        <h2>
          Your Web3,<span> Personalized.</span>
        </h2>
        <div>
          <span>Badge</span>
          <span>Token</span>
          <span>NFT</span>
          <span>WL</span>
        </div>
        <div>
          <span>Dao</span>
          <span>DeFi</span>
          <span>Game</span>
          <span>NFTs</span>
        </div>
      </div>
      <div className="magic-cube">
        <img src={MagicCubeImg} alt="" />
      </div>
    </Box>
  );
}

const Box = styled.div`
  height: 300px;
  display: flex;
  position: relative;
  background: linear-gradient(
    0deg,
    rgba(14, 10, 17, 0.8),
    rgba(14, 10, 17, 0.8)
  );
  background-image: url(${CarouselBg});
  border-radius: 20px;

  & .info {
    width: 593px;
    height: 157px;
    margin-left: 58px;
    margin-top: 73px;

    > h2 {
      font-style: italic;
      font-weight: 700;
      font-size: 40px;
      line-height: 47px;
      margin: 0;
      color: #ffffff;
      > span {
        color: #d436ff;
      }
    }

    > div {
      display: flex;
      gap: 14px;
      margin-top: 20px;
      > span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 40px;
        background: rgba(26, 30, 35, 0.5);
        border: 1px solid #39424c;
        backdrop-filter: blur(2px);
        border-radius: 12px;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        color: #ffffff;
      }

      &:last-child {
        margin-top: 10px;
      }
    }
  }

  & .magic-cube {
    position: absolute;
    padding: 26px 0;
    right: 130px;
  }
`;
