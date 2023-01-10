import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { ContentLang } from '../../services/types/contents';
import { ButtonPrimary } from '../common/button/ButtonBase';

const FEEDS_LIST = ['NFT', 'Token', 'WL', 'Badge'];
export default function OnBoard() {
  const [selectFeeds, setSelectFeeds] = useState([]);
  const [lang, setLang] = useState(ContentLang.English);

  const selectFeedsHandler = useCallback(
    (item: string, idx: number) => {
      if (selectFeeds.includes(item)) {
        setSelectFeeds([
          ...selectFeeds.slice(0, idx),
          ...selectFeeds.slice(idx + 1),
        ]);
      } else {
        setSelectFeeds([...selectFeeds, item]);
      }
    },
    [selectFeeds]
  );
  return (
    <OnBoardBox>
      <div>
        <img src="/logo192.png" alt="" />
        <h2>Welcome to U3!</h2>
        <p>Pick your favorite topics to set up your feeds.</p>
        <div className="feed-list">
          {FEEDS_LIST.map((item, idx) => {
            const hasSelect = selectFeeds.includes(item);
            return (
              <div
                key={item}
                onClick={() => {
                  selectFeedsHandler(item, idx);
                }}
                className={hasSelect ? 'selected' : ''}
              >
                {item}
              </div>
            );
          })}
        </div>
        <p>Choose your preferred languages.</p>
        <div className="lang">
          <div>
            <input
              title="en"
              type="checkbox"
              checked={lang === ContentLang.English}
              onChange={(e) => {
                if (!e.target.checked) {
                  setLang(ContentLang.中文);
                } else {
                  setLang(ContentLang.English);
                }
              }}
            />
            <span>English</span>
          </div>
          <div>
            <input
              title="zh"
              type="checkbox"
              checked={lang === ContentLang.中文}
              onChange={(e) => {
                if (e.target.checked) {
                  setLang(ContentLang.中文);
                } else {
                  setLang(ContentLang.English);
                }
              }}
            />
            <span>中文</span>
          </div>
        </div>
        <div className="btn">
          <FinishBtn>Finish</FinishBtn>
        </div>
      </div>
    </OnBoardBox>
  );
}

const OnBoardBox = styled.div`
  height: 100vh;
  overflow: scroll;
  > div {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    background: #1b1e23;
    border-radius: 20px;
    margin: 40px;
    height: calc(100vh - 80px);
    position: relative;
    padding: 40px;
    box-sizing: border-box;

    > img {
      width: 55px;
      height: 50px;
    }

    > h2 {
      margin: 0;
      margin-bottom: 20px;
      font-weight: 700;
      font-size: 36px;
      line-height: 40px;

      color: #ffffff;
    }

    > p {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      text-align: center;
      color: #718096;
      margin: 0;
    }

    > .feed-list {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 20px;

      > div {
        cursor: pointer;
        width: 100px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #1a1e23;
        border: 1px solid #39424c;
        border-radius: 12px;

        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #718096;
        &.selected {
          background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
          color: #1b1e23;
        }
      }
    }

    > .lang {
      display: flex;
      gap: 50px;
      > div {
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
      }
    }

    > .btn {
      margin-top: 30px;
    }
  }
`;

const FinishBtn = styled(ButtonPrimary)`
  width: 228px;
  height: 48px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`;
