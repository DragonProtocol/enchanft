import styled from 'styled-components';
import { DefaultState, RewardType, State } from './type';
import AddSvg from '../imgs/add.svg';
import ArrowDown from '../Icons/svgs/arrow_down.svg';
import dayjs from 'dayjs';
import UploadImgModal from '../UploadImgModal';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { TASK_IMAGE_SIZE_LIMIT, YEAR_3000 } from '../../utils/constants';
import { uploadImage as uploadImageApi } from '../../api';
import { useAppConfig } from '../../AppProvider';
import { numberInput } from '../../utils';
import { AxiosError } from 'axios';
import SwitchBtn from '../SwitchBtn';
import RichText from '../RichText';
import { Whitelist } from '../../redux/projectSlice';

export default function Information({
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
  const [noEndTime, setNoEndTime] = useState(false);

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
        <div className="information">
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

              <div className="content-item attach-file">
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

              <div className="content-item">
                <h4>Task Date</h4>
                <div className="date-box">
                  <input
                    type="datetime-local"
                    title="from-date"
                    className="date"
                    value={dayjs(state.startTime).format('YYYY-MM-DDTHH:mm')}
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
                    type="datetime-local"
                    title="to-date"
                    className="date"
                    value={dayjs(state.endTime).format('YYYY-MM-DDTHH:mm')}
                    hidden={noEndTime}
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
                <div className="no-end-time">
                  <SwitchBtn
                    width={80}
                    height={40}
                    dotHeight={32}
                    dotWidth={32}
                    open={noEndTime}
                    onChange={(v) => {
                      setNoEndTime(v)
                      const endTime = v ? YEAR_3000 : DefaultState.endTime
                      updateState({ ...state, endTime });
                    }}
                  />
                  <span>No end Time</span>
                </div>
              </div>
            </div>
            <div className="statement">
              <h4>Task statement</h4>
              <RichText
                text={state.description}
                setText={(v) => {
                  updateState({
                    ...state,
                    description: v,
                  });
                }}
              />
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
        justify-content: flex-start;
        & span {
          display: inline-block;
          width: 10px;
          height: 2px;
          background: black;
          margin:4px;
        }
        & input.date {
          box-sizing: border-box;
          width: 260px;
        }
      }

      & div.no-end-time {
        display: flex;
        align-items: center;
        margin-top: 10px;
        gap: 10px;
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
        margin: 10px;

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
      height: 545px;
      overflow: hidden;
    }
  }
`;
