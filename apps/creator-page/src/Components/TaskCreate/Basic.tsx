import styled from 'styled-components';
import { RewardType, State } from './type';
import AddSvg from '../imgs/add.svg';
import dayjs from 'dayjs';
import UploadImgModal from '../UploadImgModal';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { TASK_IMAGE_SIZE_LIMIT } from '../../utils/constants';
import { uploadImage as uploadImageApi } from '../../api';
import { DiscordBotCallback } from '../../utils/socialMedia';
import IconDiscordWhite from '../Icons/IconDiscordWhite';
import { useAppConfig } from '../../AppProvider';
import { numberInput } from '../../utils';

export default function CreateTaskBasic({
  state,
  updateState,
}: {
  state: State;
  updateState: (arg0: State) => void;
}) {
  const { account } = useAppConfig();
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
        toast.error('upload fail');
      } finally {
        setShowModal(false);
      }
    },
    [account.info, state, updateState]
  );

  return (
    <>
      <BasicBox>
        <div className="information">
          <div className="subtitle">
            <span>Information</span>
          </div>
          <div className="content">
            <div>
              <div className="content-item">
                <h4>Task title</h4>
                <input
                  title="task-title"
                  placeholder="At least 4 characters"
                  value={state?.name}
                  onChange={(e) => {
                    updateState({
                      ...state,
                      name: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="content-item">
                <h4>Task statement</h4>
                <textarea
                  title="task-statement"
                  placeholder="Input"
                  cols={30}
                  rows={10}
                  value={state.description}
                  onChange={(e) => {
                    updateState({
                      ...state,
                      description: e.target.value,
                    });
                  }}
                ></textarea>
              </div>
            </div>
            <div className="attach-file">
              <h4>Task banner (640 * 300)</h4>
              <input
                title="task-banner"
                id="task-banner"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={uploadImageHandler}
              />
              <div
                onClick={() => {
                  document.getElementById('task-banner')?.click();
                }}
              >
                {(state.image && <img src={state.image} alt="" />) || (
                  <div className="add-btn">
                    <img className="add" src={AddSvg} alt="" />
                    <br />
                    <span>Attach file</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="setting">
          <div className="subtitle">
            <span>Task Setting</span>
          </div>
          <div className="content">
            <div>
              <div className="content-item">
                <h4>Task type</h4>
                <div className="raffle-switch-box">
                  <span>Raffle:</span>
                  <div
                    className={
                      state.reward.raffled
                        ? 'raffle-switch active'
                        : 'raffle-switch'
                    }
                  >
                    <span
                      onClick={() => {
                        updateState({
                          ...state,
                          reward: {
                            ...state.reward,
                            raffled: !state.reward.raffled,
                          },
                        });
                      }}
                    ></span>
                  </div>
                </div>
                <p className="type-desc">
                  {(state.reward.raffled &&
                    'Raffle task, the task will automatically close once it winners complete the task.') ||
                    'FCFS task, we will randomly select  winners for you upon closing the task.'}
                </p>
              </div>
              <div className="content-item">
                <h4>Total winners</h4>
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
              <div className="content-item">
                <h4>Invite WL Bot</h4>
                <button
                  className="invite-bot"
                  onClick={() => {
                    window.open(
                      DiscordBotCallback,
                      '__blank',
                      `width=480,
                        height=800,
                        top=0,
                        menubar=no,
                        toolbar=no,
                        status=no,
                        scrollbars=no,
                        resizable=yes,
                        directories=no,
                        status=no,
                        location=no`
                    );
                  }}
                >
                  <IconDiscordWhite size="28px" /> Invite WL Bot
                </button>
              </div>
            </div>
            <div>
              <div className="content-item">
                <h4>Reward</h4>
                <div className="reward-btn-group">
                  <button
                    className={
                      state.reward.type === RewardType.WHITELIST ? 'active' : ''
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
                <h4>Task date</h4>
                <div className="date-box">
                  <input
                    type="date"
                    title="from-date"
                    className="date"
                    value={dayjs(state.startTime).format('YYYY-MM-DD')}
                    onChange={(e) => {
                      const startTime = dayjs(
                        e.target.value || new Date().getTime()
                      )
                        .toDate()
                        .getTime();
                      if (startTime > state.endTime) return;
                      updateState({
                        ...state,
                        startTime,
                      });
                    }}
                  />
                  <span />
                  <input
                    type="date"
                    title="to-date"
                    className="date"
                    value={dayjs(state.endTime).format('YYYY-MM-DD')}
                    onChange={(e) => {
                      const endTime = dayjs(
                        e.target.value || dayjs().add(1, 'M')
                      )
                        .toDate()
                        .getTime();
                      if (endTime < state.startTime) return;
                      updateState({
                        ...state,
                        endTime,
                      });
                    }}
                  />
                </div>
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
    justify-content: space-between;
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
        grid-template-columns: 1fr 1fr 1fr;
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
        & button:nth-child(2) {
          border-left: 4px solid #333333;
          border-right: 4px solid #333333;
        }
        & button.active {
          background: #333333;
          color: #fff;
        }
      }

      & p.type-desc {
        font-size: 14px;
        line-height: 21px;
        color: rgba(51, 51, 51, 0.6);
        margin-bottom: 0px;
        margin-top: 10px;
      }

      & div.raffle-switch-box {
        display: flex;
        align-items: center;
        margin-top: 10px;
        > span {
          font-weight: 400;
          font-size: 18px;
          line-height: 27px;
          margin-right: 10px;
        }
        & .raffle-switch {
          display: inline-block;
          position: relative;
          width: 100px;
          height: 50px;
          padding: 5px;
          border-radius: 25px;
          background: #ebeee4;
          transition: all 0.1s ease-out;
          box-sizing: border-box;
          & > span {
            cursor: pointer;
            display: inline-block;
            position: absolute;
            left: 5px;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            background-color: #fff;
            transition: all 0.1s ease-out;
          }
          &.active {
            background-color: #3dd606;
            & > span {
              left: 55px;
            }
          }
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
  & select {
    width: 100%;
  }
  & input,
  & textarea {
    font-family: inherit;
    background-color: #f8f8f8;
    border: none;
    outline: none;
    padding: 12px 20px;
    font-size: 18px;
    line-height: 27px;
    background: #ebeee4;
    border-radius: 10px;
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
`;
