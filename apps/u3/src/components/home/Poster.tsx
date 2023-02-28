/* eslint-disable */
import styled from 'styled-components';

import qrCodeU3 from '../imgs/qrcode_u3.xyz.png';

export default function Poster({ data }: { data: any }) {
  return (
    <Box>
      <h1 className="topic">Daily Poster</h1>
      <div className="flex">
        <div>Today‘s Referrers</div>
        <div>u3</div>
      </div>
      <div className="line-box">
        <div className="line" />
        <div className="line" />
      </div>
      <div className="contents">
        <div>
          <div className="title">u3</div>
          <div className="desc">u3</div>
        </div>
        <div>
          <div className="title">u3</div>
          <div className="desc">u3</div>
        </div>

        {/* dapp */}
        <div>
          <h2 className="topic-h2">Which Dapps are Popular?</h2>

          <div className="dapp-box">
            <div className="dapp-item"></div>
          </div>
        </div>
        {/* event */}
        <div>
          <div className="flag">Trending Event</div>
          <div className="title">u3</div>
        </div>
        <div>
          <div className="flag">Trending Event</div>
          <div className="title">u3</div>
        </div>
        <div>
          <div className="flag">Trending Event</div>
          <div className="title">u3</div>
        </div>
        <div>
          <div className="flag">Trending Event</div>
          <div className="title">u3</div>
        </div>
      </div>

      <div className="line-box">
        <div className="line" />
        <div className="line" />
      </div>

      <img className="qrcode" src={qrCodeU3} />

      <div className="website">U3.XYZ</div>
    </Box>
  );
}

const Box = styled.div`
  width: 375px;
  background: black;
  color: white;

  font-family: 'Marion';
  font-style: normal;
  padding: 20px 10px 75px;

  .topic {
    font-weight: 700;
    font-size: 60px;
    line-height: 63px;
  }

  .topic-h2 {
    font-size: 30px;
    line-height: 32px;

    text-align: center;

    margin-bottom: 10px;
  }

  /* .line-box{
    &:last-child{
        margin-top: 4px;
    }
  } */

  .line {
    height: 2px;
    background: white;
    &:last-child {
      margin-top: 4px;
    }
  }

  .contents {
    & > div {
      padding: 20px 0;
      border-bottom: 1px solid white;
      &:last-child {
        border: none;
      }
    }
  }

  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 21px;
  }

  .big-title {
    font-size: 36px;
    line-height: 38px;
  }

  .desc {
    font-weight: 400;
    font-size: 12px;
    line-height: 13px;

    margin-top: 10px;
  }

  .flag {
    font-weight: 400;
    font-size: 12px;
    line-height: 13px;
    /* identical to box height */

    background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    margin-bottom: 10px;
  }

  .dapp-box {
    .dapp {
      border-radius: 20px;
    }
  }

  .qrcode {
    width: 200px;
    height: 200px;
    border-radius: 20px;
    margin: 20px auto;
    display: block;
  }

  .website {
    font-weight: 700;
    font-size: 12px;
    line-height: 13px;

    text-align: center;
    letter-spacing: 10px;
  }

  //-------- css ----------

  .flex {
    display: flex;
  }
  /* display: flex;
  align-items: center;
  justify-content: space-between; */
  > span {
    font-style: italic;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;

    color: #ffffff;
  }

  > button {
    outline: none;
    border: none;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    background-color: inherit;
    cursor: pointer;
    text-align: center;

    color: #718096;
  }
`;
