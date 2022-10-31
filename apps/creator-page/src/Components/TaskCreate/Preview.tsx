import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getTaskRewardTypeLabel } from '../../utils/task';
import IconDiscord from '../Icons/IconDiscord';
import IconNotify from '../Icons/IconNotify';
import IconTwitter from '../Icons/IconTwitter';
import PngIconAlarmClock from '../Icons/PngIconAlarmClock';
import PngIconCaretLeft from '../Icons/PngIconCaretLeft';
import PngIconGiftBox from '../Icons/PngIconGiftBox';
import IconWL from '../Icons/IconWL';
import { ActionType, ActionTypeMore, RewardType, State } from './type';
import IconTip from '../Icons/IconTip';
import PngIconScissorHand from '../Icons/PngIconScissorHand';
import IconCustom from '../Icons/IconCustom';
import IconWallet from '../Icons/IconWallet';
import IconNFT from '../Icons/IconNft';
import IconQuestion from '../Icons/IconQuestion';

export default function Preview({
  state,
  projectName,
  open,
  closeHandler,
  submitResult,
}: {
  state: State;
  projectName: string;
  open: boolean;
  closeHandler: () => void;
  submitResult: () => void;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  useEffect(() => {
    const scrollBox = document.getElementById('main');
    if (!scrollBox) return;
    const onScroll = (e: any) => {
      setScrollTop(e.target?.scrollTop || 0);
    };
    scrollBox.addEventListener('scroll', onScroll);
    return () => scrollBox.removeEventListener('scroll', onScroll);
  }, [scrollTop]);

  return (
    <>
      <TaskPreviewWrapper
        id="task-preview-wrapper"
        style={{ display: open ? '' : 'none' }}
      >
        {scrollTop > 23 && <div className="tint placeholder"></div>}
        <div className={scrollTop > 23 ? 'tint fixed' : 'tint'}>
          <p>
            {' '}
            Please check the event page carefully as it cannot be edited once
            submitted.
          </p>
        </div>

        <div className="container">
          <div className="title-container">
            <button title="back" onClick={closeHandler}>
              <PngIconCaretLeft />
            </button>
            <div className="title">
              <h3>{state.name}</h3>
              <div className="project">Project: {projectName}</div>
            </div>
          </div>

          <div className="infos">
            <div className="left">
              <img src={state.image} alt="" />
              <h3>
                {getTaskRewardTypeLabel({
                  type: state.reward.type,
                  raffled: state.reward.raffled,
                })}
              </h3>
              <div className="items">
                <div className="alarm">
                  <PngIconAlarmClock />
                  <span>
                    {dayjs(state.startTime).format('YYYY/MM/DD')}——
                    {dayjs(state.endTime).format('YYYY/MM/DD')}
                  </span>
                </div>
                <div className="winners">
                  <PngIconScissorHand />
                  <span>Winners: {state.winnerNum}</span>
                </div>
              </div>
              <div className="items">
                <PngIconGiftBox />
                {state.reward.type === RewardType.WHITELIST && (
                  <span>Reward: whitelist</span>
                )}
                {state.reward.type === RewardType.OTHERS && (
                  <span>Reward: {state.reward.name}</span>
                )}
                {state.reward.type === RewardType.CONTRIBUTION_TOKEN && (
                  <span>
                    Reward: {state.reward.token_num} contribution token
                  </span>
                )}
              </div>

              <div className="desc">
                <div className="ql-snow">
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html: state.description }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="right">
              <div>
                <button>Take the Task</button>
                {state.actions.map((item, idx) => {
                  let Icon;
                  if (item.type === ActionType.DISCORD) {
                    Icon = IconDiscord;
                  }
                  if (item.type === ActionType.TWITTER) {
                    Icon = IconTwitter;
                  }
                  if (item.type === ActionType.NOTIFY) {
                    Icon = IconNotify;
                  }
                  if (item.type === ActionType.UNKNOWN) {
                    Icon = IconTip;
                  }
                  if (item.type === ActionType.WL) {
                    Icon = IconWL;
                  }
                  if (item.type === ActionType.COIN) {
                    Icon = IconWallet;
                  }
                  if (item.type === ActionType.NFT) {
                    Icon = IconNFT;
                  }
                  if (item.type === ActionType.CUSTOM) {
                    Icon = IconCustom;
                  }
                  if (item.type === ActionType.QUESTIONNAIRE) {
                    Icon = IconQuestion;
                  }
                  if (
                    item.typeMore === ActionTypeMore.CUSTOM &&
                    item.description
                  ) {
                    Icon = IconTip;
                  }
                  return (
                    <div key={idx} className="action-item">
                      <p>{item.name || item.description}</p>
                      <div className="desc">
                        {item.description && <span>{item.description}</span>}
                        {Icon && <Icon />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <SubmitBtn>
          <div>
            <button onClick={submitResult}>Submit</button>
          </div>
        </SubmitBtn>
      </TaskPreviewWrapper>
    </>
  );
}

const TaskPreviewWrapper = styled.div`
  width: 100%;
  margin: 20px 0 40px 0;
  background: #f7f9f1;
  border: 4px solid #333333;
  border-radius: 20px;
  box-sizing: border-box;
  overflow: hidden;

  & .tint {
    height: 50px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(237, 209, 125, 1);
    & p {
      margin: 0;
      font-size: 16px;
      line-height: 24px;
      color: #333333;
      font-weight: 400;
    }

    &.fixed {
      position: fixed;
      width: 1200px;
      top: 72px;
    }

    &.placeholder {
      background: inherit;
    }
  }

  & .container {
    position: relative;
    padding: 40px;
    & .back-btn {
      position: absolute;
      left: 40px;
    }

    & .title-container {
      display: flex;
      gap: 20px;

      > button {
        width: 48px;
        height: 48px;
        background: #e4ffdb;
        border: 2px solid #333333;
        box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
        border-radius: 20px;
        /* transform: matrix(-1, 0, 0, 1, 0, 0); */
        & img {
          vertical-align: middle;
          height: 18px;
          width: 12px;
        }
      }
    }

    & .title {
      h3 {
        margin: 5px 0;
        font-weight: 700;
        font-size: 36px;
        line-height: 40px;
        color: #333333;
      }
    }

    & .project {
      margin: 14px 0;
      font-weight: 400;
      font-size: 20px;
      line-height: 30px;
      color: #3dd606;
    }

    & .img > img {
      width: 100%;
    }

    & .infos {
      margin-top: 10px;
      display: flex;
      gap: 40px;
      > div {
        flex-grow: 1;
      }

      > div.left {
        & img {
          border-radius: 10px;
          margin-bottom: 26px;
          width: 100%;
          max-height: 300px;
        }
        & h3 {
          margin: 0;
        }
        > div {
          margin: 10px 0;
          height: 21px;
          color: #333333;
          display: flex;
          align-items: center;

          > span {
            display: inline-block;
            width: 50%;
            margin: 0 5px;
            font-weight: 400;
            font-size: 14px;
            line-height: 21px;
          }
        }

        & .desc {
          height: auto;
          font-weight: 400;
          font-size: 14px;
          line-height: 21px;
          display: initial;

          color: rgba(51, 51, 51, 0.6);

          & > p {
            margin: 0;
            white-space: pre-wrap;
          }
        }
      }

      > div.right,
      > div.left {
        width: 50%;
        box-sizing: border-box;

        & .items {
          margin-bottom: 10px;
          & img {
            margin-bottom: 0;
          }

          & .alarm,
          & .winners {
            margin-bottom: 10px;
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            gap: 4px;
            background: #d3ed85;
            border-radius: 20px;
            margin-right: 10px;
          }

          & span {
            font-weight: 700;
            font-size: 14px;
            line-height: 21px;
            color: #333333;
          }

          & .winners {
          }
        }
      }
      > div.right {
        > div {
          border-radius: 10px;
          padding: 20px;
          background: #ebeee4;
          border-radius: 10px;
          > button {
            border-radius: 10px;
            background-color: #3dd606;
            box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
            outline: none;
            height: 48px;
            border: none;
            width: 100%;
            font-weight: 700;
            font-size: 18px;
            line-height: 27px;
            color: #ffffff;
            margin-bottom: 20px;
          }
        }

        & .action-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          & p {
            margin: 0;
            margin-left: 10px;
            flex-grow: 1;
          }

          & div.desc {
            position: relative;
            & span {
              display: none;
              position: absolute;
              top: -25px;
              transform: translate(-70%);
              padding: 3px 10px;
              border-radius: 5px;
              background: #f7f9f1;
            }
            &:hover {
              & span {
                display: block;
              }
            }
          }
        }
        & .action-item:last-child {
          margin: 0;
        }
      }

      & h3 {
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;

        color: #333333;
      }
    }
  }
`;
const SubmitBtn = styled.div`
  /* left: 0; */
  /* position: fixed; */
  /* bottom: 0; */
  /* width: 100%; */
  /* bottom: 0; */
  background: #f7f9f1;
  border-top: 4px solid #333333;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    height: 68px;
    box-shadow: 0px -4px 0px rgba(0, 0, 0, 0.25);
    & button {
      cursor: pointer;
      border: none;
      outline: none;
      background-color: #3dd606;
      color: #fff;
      border-radius: 10px;
      width: 200px;
      height: 48px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25),
        inset 0px -4px 0px rgba(0, 0, 0, 0.25);
    }
  }
`;
