import { useEffect, useState } from 'react';
import styled from 'styled-components';
import TextTransition, { presets } from 'react-text-transition';
import Rubiks from '../magic-kube/rubiks/index';

import CarouselBg from '../imgs/carousel-bg.png';

const TEXTS = [
  'Identity',
  'POAP',
  'Token',
  'NFT',
  'WL',
  'Airdrop',
  'DAO',
  'DeFi',
  'Games',
  'Reputation',
];

export default function Carousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((i) => i + 1),
      3000 // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);
  useEffect(() => {
    const container = document.getElementById('magic-cube-container');
    if (!container.childNodes.length) {
      const rubiks = new Rubiks(container);
      rubiks.disorder();
    }
  }, []);
  return (
    <Box>
      <div className="info">
        <h2>Your Data,</h2>
        <h2>Your Content,</h2>
        <h2> Your Web3.</h2>
        <div>
          Hub For Your Self Sovereign Data and
          <TextTransition springConfig={presets.wobbly}>
            {TEXTS[index % TEXTS.length]}
          </TextTransition>
        </div>
        {/* <div>
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
        </div> */}
      </div>
      <div className="magic-cube" id="magic-cube-container">
        {/* <img src={MagicCubeImg} alt="" /> */}
      </div>
    </Box>
  );
}

const Box = styled.div`
  height: 400px;
  display: flex;
  position: relative;
  background: linear-gradient(
    0deg,
    rgba(14, 10, 17, 0.8),
    rgba(14, 10, 17, 0.8)
  );
  background-image: url(${CarouselBg});
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 20px;

  & .info {
    margin-left: 80px;
    margin-top: 87px;

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
      font-weight: 500;
      font-size: 24px;
      line-height: 28px;
      padding: 0 7px;
      color: #ffffff;

      > div {
        > div {
          background: linear-gradient(91.5deg, #cd62ff 44.54%, #62aaff 85.29%),
            #ffd318;
          -webkit-background-clip: text;
          color: transparent;
        }
      }
    }

    > div {
      display: flex;
      gap: 10px;
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
    right: 60px;
    width: 400px;
    height: 400px;
  }
`;
