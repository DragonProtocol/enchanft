import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';

import { useAppDispatch } from '../../store/hooks';
import { ContentListItem } from '../../services/types/contents';

export default function Today({
  contents,
}: {
  contents: Array<ContentListItem>;
}) {
  return (
    <Box>
      <div className="flex items-center">
        <h1 className="topic">Daily Poster</h1>
        <div className="text sub-title">Web3 Today</div>
        <div className="viewBtn">View →</div>
      </div>
      <div className="line-box">
        <div className="line" />
        <div className="line" />
      </div>
      <div className="contents">
        {contents?.slice(0, 3)?.map((content, index) => (
          <div key={content?.id}>
            <div className="title">{content?.title}</div>
            {content?.description && (
              <div className="desc">{content?.description}</div>
            )}
          </div>
        ))}
      </div>
    </Box>
  );
}

const Box = styled.div`
  width: 100%;
  max-height: 300px;

  background: #f7f6f4;
  color: black;

  font-family: 'Marion';
  font-style: normal;
  padding: 20px 10px 75px;
  box-sizing: border-box;
  border-radius: 8px;

  .topic {
    font-weight: 700;
    font-size: 60px;
    line-height: 63px;
    /* text-align: center; */
    margin: 20px 0;
  }

  .topic-h2 {
    font-size: 30px;
    line-height: 32px;

    text-align: center;

    margin-bottom: 20px;
  }

  .sub-title {
    font-family: 'Snell Roundhand';
    /* font-style: italic; */
    font-weight: 700;
    font-size: 40px;
    line-height: 18px;
    margin-left: 40px;
    .multiple {
      margin: 0 7px;
    }
    & svg:first-of-type {
      width: 25px;
      height: 25px;
    }
    & path {
      fill: rgb(255, 255, 255);
    }
  }

  .text {
    margin-right: 20px;
  }

  .viewBtn {
    width: 193px;
    height: 66px;
    text-align: center;
    line-height: 66px;
    color: white;

    background: #14171a;
    border-radius: 40px;

    font-family: 'Marion';
    font-style: normal;
    font-weight: 700;
    font-size: 30px;
    color: #f7f6f4;

    cursor: pointer;
    margin-left: auto;
  }

  .line {
    height: 2px;
    background: black;
    &:last-child {
      margin-top: 4px;
    }
  }

  .contents {
    position: relative;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(282px, 1fr));
    padding-top: 30px;
    & > div {
      /* width: 33%; */
      /* padding: 20px 0; */
      border-bottom: 1px solid white;
      &:last-child {
        border: none;
      }
    }

    &::before {
      content: '';
      width: 1px;
      height: calc(100% - 30px);
      background: black;
      position: absolute;
      top: 50%;
      left: 33%;
      transform: translate(0, -50%);
    }
    &::after {
      content: '';
      width: 1px;
      height: calc(100% - 30px);
      background: black;
      position: absolute;
      top: 50%;
      left: 66%;
      transform: translate(0, -50%);
    }
  }

  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 21px;
    overflow: hidden;
    /* white-space: nowrap; */
    display: -webkit-box;

    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    box-pack: center;
    box-align: center;

    -webkit-line-clamp: 2;
  }

  .desc {
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1.1px;
    /* line-height: 13px; */

    margin-top: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .flag {
    font-weight: 400;
    font-size: 12px;
    line-height: 13px;
    display: inline-block;
    /* identical to box height */

    background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    margin-bottom: 10px;
  }

  //-------- css ----------

  .flex {
    display: flex;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .col-gap-7 {
    column-gap: 7px;
  }
`;
