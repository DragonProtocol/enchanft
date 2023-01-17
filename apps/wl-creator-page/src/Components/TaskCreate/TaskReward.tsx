import styled from 'styled-components';
import { RewardType, State } from './type';
import AddSvg from '../imgs/add.svg';
import ArrowDown from '../Icons/svgs/arrow_down.svg';
import dayjs from 'dayjs';
import UploadImgModal from '../UploadImgModal';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { TASK_IMAGE_SIZE_LIMIT } from '../../utils/constants';
import { uploadImage as uploadImageApi } from '../../api';
import { useAppConfig } from '../../AppProvider';
import { numberInput } from '../../utils';
import { AxiosError } from 'axios';
import SwitchBtn from '../SwitchBtn';
import RichText from '../RichText';
import { Whitelist } from '../../redux/projectSlice';

export default function TaskReward({
  hasInviteBot,
  state,
  updateState,
  whitelist,
}: {
  hasInviteBot: boolean;
  state: State;
  whitelist: Whitelist[];
  updateState: (arg0: State) => void;
}) {
  const { account, updateAccount } = useAppConfig();
  const [showModal, setShowModal] = useState(false);

  const uploadImageHandler = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if ((file as File).size > TASK_IMAGE_SIZE_LIMIT) {
        toast.error('File Too Large. 1M Limit');
        return;
      }
      setShowModal(true);

      if (!account.info) return;

      try {
        const { data } = await uploadImageApi(file, account.info.token);
        updateState({
          ...state,
          image: data.url,
        });
        e.target.value = '';
        toast.success('upload success');
      } catch (error) {
        const err: AxiosError = error as any;
        if (err.response?.status === 401) {
          toast.error('Login has expired,please log in again!');
          updateAccount({ ...account, info: null });
        } else {
          toast.error('upload fail');
        }
      } finally {
        setShowModal(false);
      }
    },
    [account, updateState, state, updateAccount]
  );

  return (
    <>
      <BasicBox>
        <div className="setting">
          <div className="content">
            <div>
              <div className="content-item">
                <h4>Task type</h4>
                <div className="raffle-switch-box">
                  <SwitchBtn
                    width={80}
                    height={40}
                    dotWidth={32}
                    dotHeight={32}
                    open={state.reward.raffled}
                    onChange={(v) => {
                      updateState({
                        ...state,
                        reward: {
                          ...state.reward,
                          raffled: v,
                          luckyDraw: !v,
                        },
                      });
                    }}
                  />
                  <div className="desc">
                    <p>Raffle</p>
                    <p className="type-desc">
                      {(state.reward.raffled &&
                        'Raffle task, the winner will randomly or manually select from entries.') ||
                        'FCFS task, first come, first served.'}
                    </p>
                  </div>
                </div>
                {state.reward.raffled && (
                  <div className="raffle-switch-box">
                    <SwitchBtn
                      width={80}
                      height={40}
                      dotWidth={32}
                      dotHeight={32}
                      open={state.reward.luckyDraw}
                      onChange={(v) => {
                        updateState({
                          ...state,
                          reward: {
                            ...state.reward,
                            luckyDraw: v,
                          },
                        });
                      }}
                    />
                    <div className="desc">
                      <p>Lucky draw</p>
                      <p className="type-desc">
                        {(state.reward.luckyDraw &&
                          'The more actions completed,the higher chance to win.') ||
                          'Complete all actions to get entry.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="content-item">
                <h4>Reward</h4>
                <div
                  className={
                    'reward-btn-group ' +
                    (whitelist.length > 0 ? 'three' : 'two')
                  }
                >
                  {whitelist.length > 0 && (
                    <button
                      className={
                        state.reward.type === RewardType.WHITELIST
                          ? 'active'
                          : ''
                      }
                      onClick={() => {
                        updateState({
                          ...state,
                          reward: {
                            ...state.reward,
                            name: '',
                            type: RewardType.WHITELIST,
                          },
                        });
                      }}
                    >
                      Whitelist
                    </button>
                  )}
                  <button
                    className={
                      state.reward.type === RewardType.OTHERS ? 'active' : ''
                    }
                    onClick={() => {
                      updateState({
                        ...state,
                        reward: {
                          ...state.reward,
                          type: RewardType.OTHERS,
                        },
                      });
                    }}
                  >
                    Other
                  </button>
                  <button
                    className={
                      state.reward.type === RewardType.CONTRIBUTION_TOKEN
                        ? 'active'
                        : ''
                    }
                    onClick={() => {
                      updateState({
                        ...state,
                        reward: {
                          ...state.reward,
                          name: '',
                          type: RewardType.CONTRIBUTION_TOKEN,
                        },
                      });
                    }}
                  >
                    Contribution Token
                  </button>
                </div>
                {state.reward.type === RewardType.WHITELIST && (
                  <select
                    title="whitelist"
                    value={state.reward.whitelist_id}
                    onChange={(e) => {
                      updateState({
                        ...state,
                        reward: {
                          ...state.reward,
                          whitelist_id: Number(e.target.value),
                        },
                      });
                    }}
                  >
                    {whitelist.map((item, idx) => {
                      return (
                        <option key={item.id} value={item.id}>
                          Whitelist {idx + 1}
                        </option>
                      );
                    })}
                  </select>
                )}
                {state.reward.type === RewardType.OTHERS && (
                  <input
                    type="text"
                    title="reward-others-name"
                    placeholder={
                      state.reward.type === RewardType.OTHERS ? 'Name' : ''
                    }
                    value={state.reward.name}
                    onChange={(e) => {
                      updateState({
                        ...state,
                        reward: {
                          ...state.reward,
                          name: e.target.value,
                        },
                      });
                    }}
                  />
                )}
                {state.reward.type === RewardType.CONTRIBUTION_TOKEN && (
                  <input
                    type="number"
                    title="reward-others-name"
                    value={
                      state.reward.token_num
                        ? state.reward.token_num === 0
                          ? ''
                          : state.reward.token_num?.toString()
                        : ''
                    }
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      updateState({
                        ...state,
                        reward: {
                          ...state.reward,
                          token_num: num,
                        },
                      });
                    }}
                  />
                )}
              </div>
              <div className="content-item">
                <h4>Total Winners</h4>
                <input
                  title="total-winners"
                  type={'number'}
                  min={'0'}
                  onKeyPress={numberInput}
                  value={
                    state.winnerNum === 0 ? '' : state.winnerNum.toString()
                  }
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    updateState({
                      ...state,
                      winnerNum: num,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </BasicBox>

      <UploadImgModal
        show={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}

const BasicBox = styled.div`
  & .content {
    display: flex;
    justify-content: center;
    > div {
      width: 540px;
    }

    & div.content-item {
      display: flex;
      flex-direction: column;

      & div.date-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        & span {
          display: inline-block;
          width: 10px;
          height: 2px;
          background: black;
        }
        & input.date {
          box-sizing: border-box;
          width: 260px;
        }
      }

      & div.reward-btn-group {
        margin-bottom: 10px;
        border-radius: 10px;
        overflow: hidden;
        border: 4px solid #333333;
        display: grid;

        &.three {
          grid-template-columns: 1fr 1fr 1fr;
          & button:nth-child(2) {
            border-left: 4px solid #333333;
            border-right: 4px solid #333333;
          }
        }
        &.two {
          grid-template-columns: 1fr 1fr;
        }
        & button {
          border: none;
          outline: none;
          background: #f7f9f1;
          border-radius: 0;
          font-size: 18px;
          line-height: 27px;
          height: 50px;
          cursor: pointer;
        }

        & button.active {
          background: #333333;
          color: #fff;
        }
      }

      & div.raffle-switch-box {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;

        > .desc {
          & p {
            margin: 0;
            &.type-desc {
              font-weight: 400;
              font-size: 12px;
              line-height: 18px;
              color: rgba(51, 51, 51, 0.6);
              margin-bottom: 0px;
            }
          }
        }
        /* > span {
          font-weight: 400;
          font-size: 18px;
          line-height: 27px;
          margin-right: 10px;
        } */
      }

      & .invite-bot-container {
        display: flex;
        gap: 10px;
        align-items: center;
        & button {
          flex-grow: 1;
        }
      }

      & button.invite-bot {
        height: 50px;
        background: #5368ed;
        box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        color: #ffffff;
        & svg {
          vertical-align: bottom;
          margin-right: 10px;
        }
      }
    }
  }

  & select,
  & input,
  & textarea {
    font-family: inherit;
    border: none;
    outline: none;
    padding: 12px 20px;
    font-size: 18px;
    line-height: 27px;
    background: #ebeee4;
    border-radius: 10px;
  }

  & select {
    width: 100%;
    -webkit-appearance: none;
    -moz-appearance: none;

    background-image: url(${ArrowDown});
    background-repeat: no-repeat;
    background-position-x: calc(100% - 20px);
    background-position-y: 19px;
  }

  & textarea {
    resize: none;
    padding: 12px 20px;
    height: 133px;
  }

  & .attach-file {
    & img {
      width: 100%;
      max-height: 300px;
    }
    & img.add {
      width: 40px;
      height: 40px;
    }
    > div {
      background: #ebeee4;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 260px;
      overflow: hidden;
      & .add-btn {
        cursor: pointer;
        text-align: center;
        & svg {
          width: 40px;
          height: 40px;
        }
      }
    }

    > #task-banner {
      display: none;
    }
  }

  & .statement {
    > div {
      background: #ebeee4;
      border-radius: 10px;
      overflow: hidden;
    }
  }
`;
