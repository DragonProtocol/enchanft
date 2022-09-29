import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import CrownImg from '../imgs/crown.svg';
import {
  PickedWhiteList,
  ScheduleInfo,
  Winner,
} from '../../redux/creatorDashboard';
import { sortPubKey } from '../../utils';
import { getTaskRewardTypeLabel } from '../../utils/task';
import IconCheckbox from '../Icons/IconCheckbox';
import IconCheckboxChecked from '../Icons/IconCheckboxChecked';
import { RewardType } from '../TaskCreate/type';
import UserAvatar from '../UserAvatar';
import ConfirmModal from './ConfirmModal';
import IconDownload from '../Icons/IconDownload';
import IconTweet from '../Icons/IconTweet';
import IconRandom from '../Icons/IconRandom';
import AlarmModal from './AlarmModal';

// TODO rebuild

export default function WinnerList({
  reward,
  winnerNum,
  winnerList,
  candidateList,
  pickedWhiteList,
  participantList,
  schedules,
  uploadSelected,
  whitelistSaved,
  downloadWinners,
}: {
  reward: { raffled: boolean; type: RewardType };
  winnerNum: number;
  whitelistSaved: boolean;
  winnerList: Array<Winner>;
  candidateList: Array<Winner>;
  participantList: Array<Winner>;
  pickedWhiteList: Array<PickedWhiteList>;
  schedules: ScheduleInfo | null;
  uploadSelected: (arg0: Array<number>) => void;
  downloadWinners: (arg0: string) => void;
}) {
  const tabs = ['whitelist', 'candidates', 'participants'];
  const label = getTaskRewardTypeLabel(reward);
  const [selected, setSelected] = useState<Array<number>>([]);
  const [disableSelect, setDisableSelect] = useState(false);

  const [tweetAlarmModalShow, setTweetAlarmModalShow] = useState({
    show: false,
    msg: '',
  });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const genRandom = useCallback(() => {
    let tmpList = [...candidateList];
    let num = Math.min(winnerNum, tmpList.length);
    const result: Array<number> = [];
    while (num > 0) {
      const arrLen = tmpList.length;
      const randomNum = getRandomInt(0, arrLen);
      const item = tmpList[randomNum];
      result.push(item.id);
      tmpList = [
        ...tmpList.slice(0, randomNum),
        ...tmpList.slice(randomNum + 1),
      ];
      num -= 1;
    }
    setSelected(result);
    setDisableSelect(true);
  }, [candidateList, winnerNum]);

  const tweetWinners = useCallback((winners: string[]) => {
    console.log({ winners });
    if (winners.length === 0) {
      setTweetAlarmModalShow({
        show: true,
        msg: '',
      });
      return;
    }
    const data = 'Winners 🏆 ' + winners.join(' ');
    if (data.length > 8000) {
      setTweetAlarmModalShow({
        show: true,
        msg: 'Too many tweet',
      });
      return;
    }
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(data)}`,
      '_blank'
    );
  }, []);

  const dateNow = new Date();
  const schedulesEndTime = schedules?.endTime
    ? new Date(schedules?.endTime)
    : dateNow;

  const taskEnded = dateNow > schedulesEndTime;
  const isFCFS = label === 'FCFS';

  const [activeList, setActiveList] = useState(
    isFCFS ? 'candidates' : 'whitelist'
  );

  const winners = useMemo(() => {
    if (isFCFS) {
      const data = candidateList
        .map((item) => item.thirdpartyName)
        .filter((item) => !!item);
      return data;
    }
    const data = winnerList
      .map((item) => item.thirdpartyName)
      .filter((item) => !!item);
    return data;
  }, [winnerList, candidateList, isFCFS]);

  if (isFCFS) {
    return (
      <>
        <WinnerListBox>
          <div className="title">
            <h3>
              <span
                className={(activeList === 'candidates' && 'active') || ''}
                onClick={() => {
                  setActiveList('candidates');
                }}
              >
                Entries
              </span>
              <span
                className={(activeList === 'participants' && 'active') || ''}
                onClick={() => {
                  setActiveList('participants');
                }}
              >
                Participants
              </span>
            </h3>

            <div>
              <CustomBtn onClick={() => downloadWinners(activeList)}>
                <IconDownload size="18px" />
              </CustomBtn>
              {whitelistSaved && (
                <CustomBtn onClick={() => tweetWinners(winners)}>
                  <IconTweet size="18px" />
                </CustomBtn>
              )}
            </div>
          </div>
          <div className="list">
            {(activeList === 'candidates'
              ? candidateList
              : participantList
            ).map((item, idx) => {
              return <PickedList key={idx} idx={idx} data={item} />;
            })}
          </div>
        </WinnerListBox>

        <AlarmModal
          show={tweetAlarmModalShow.show}
          msg={tweetAlarmModalShow.msg}
          closeModal={() => {
            setTweetAlarmModalShow({
              show: false,
              msg: '',
            });
          }}
        />

        <ConfirmModal
          show={confirmModalOpen}
          closeModal={() => {
            setConfirmModalOpen(false);
          }}
          confirmSubmit={() => {
            uploadSelected(selected);
            setConfirmModalOpen(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <WinnerListBox>
        <div className="title">
          <h3>
            <span
              className={(activeList === 'whitelist' && 'active') || ''}
              onClick={() => {
                setActiveList('whitelist');
              }}
            >
              Winners
            </span>
            <span
              style={{
                borderLeft: '2px solid #333333',
                borderRight: '2px solid #333333',
              }}
              className={(activeList === 'candidates' && 'active') || ''}
              onClick={() => {
                setActiveList('candidates');
              }}
            >
              Entries
            </span>
            <span
              className={(activeList === 'participants' && 'active') || ''}
              onClick={() => {
                setActiveList('participants');
              }}
            >
              Participants
            </span>
          </h3>
          <div>
            <CustomBtn onClick={() => downloadWinners(activeList)}>
              <IconDownload size="18px" />
            </CustomBtn>
            {whitelistSaved && (
              <CustomBtn onClick={() => tweetWinners(winners)}>
                <IconTweet size="18px" />
              </CustomBtn>
            )}
            {activeList === 'candidates' && !whitelistSaved && (
              <>
                <CustomBtn onClick={genRandom}>
                  <IconRandom size="18px" />
                </CustomBtn>
                <CustomBtn
                  onClick={() => {
                    setConfirmModalOpen(true);
                  }}
                >
                  Confirm {selected.length}
                </CustomBtn>
              </>
            )}
          </div>
        </div>
        <div className="list">
          {activeList === 'whitelist' &&
            winnerList.map((item, idx) => {
              return <PickedList key={idx} idx={idx} data={item} />;
            })}
          {activeList === 'candidates' &&
            candidateList.map((item, idx) => {
              const checked = whitelistSaved
                ? pickedWhiteList.find(
                    (pickedItem) => pickedItem.user_id === item.id
                  )
                : selected.includes(item.id);
              const disabled =
                whitelistSaved ||
                (disableSelect && !selected.includes(item.id));
              return (
                <ListItem
                  key={idx}
                  idx={idx}
                  data={item}
                  checked={!!checked}
                  disabled={disabled}
                  selected={selected}
                  setSelected={(newSelected) => {
                    setDisableSelect(newSelected.length >= winnerNum);
                    setSelected(newSelected);
                  }}
                  couldSelect={!isFCFS ? !whitelistSaved && taskEnded : false}
                />
              );
            })}
          {activeList === 'participants' &&
            participantList.map((item, idx) => {
              return <PickedList key={idx} idx={idx} data={item} />;
            })}
        </div>
      </WinnerListBox>

      <AlarmModal
        show={tweetAlarmModalShow.show}
        msg={tweetAlarmModalShow.msg}
        closeModal={() => {
          setTweetAlarmModalShow({
            show: false,
            msg: '',
          });
        }}
      />

      <ConfirmModal
        show={confirmModalOpen}
        closeModal={() => {
          setConfirmModalOpen(false);
        }}
        confirmSubmit={() => {
          uploadSelected(selected);
          setConfirmModalOpen(false);
        }}
      />
    </>
  );
}

function ListItem({
  idx,
  data,
  checked,
  disabled,
  selected,
  setSelected,
  couldSelect,
}: {
  idx: number;
  data: Winner;
  checked: boolean;
  disabled: boolean;
  couldSelect: boolean;
  selected: Array<number>;
  setSelected: (arg0: Array<number>) => void;
}) {
  return (
    <div>
      <div>
        <span className={idx < 3 ? 'index front-3' : 'index'}>{idx + 1}</span>
        <span>
          <UserAvatar src={data.avatar} />
        </span>
        <span className="name">{data.name}</span>
        <span className="pubkey">{sortPubKey(data.pubkey, 16)}</span>
      </div>
      {couldSelect && (
        <CustomCheckBox
          checked={checked}
          onChange={() => {
            if (disabled) return;
            if (!couldSelect) return;
            if (selected.includes(data.id)) {
              const newArr = selected.filter((item) => {
                return item !== data.id;
              });
              setSelected(newArr);
            } else {
              selected.push(data.id);
              setSelected([...selected]);
            }
          }}
        />
      )}
    </div>
  );
}

function PickedList({ idx, data }: { idx: number; data: any }) {
  return (
    <div>
      <div>
        <span className={idx < 3 ? 'index front-3' : 'index'}>{idx + 1}</span>
        <span>
          <UserAvatar src={data?.avatar} />
        </span>
        <span className="name">{data?.name}</span>
        <span className="pubkey">{sortPubKey(data?.pubkey || '', 16)}</span>
      </div>
    </div>
  );
}

function CustomCheckBox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <span
      onClick={() => {
        onChange();
      }}
    >
      {checked ? <IconCheckboxChecked /> : <IconCheckbox />}
    </span>
  );
}

const CustomBtn = styled.button`
  padding: 10px;
  border-radius: 20px;
  background: #ebeee4;
  box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
  outline: none;
  border: none;
`;

const ModalBtnBox = styled.div`
  display: flex;
  justify-content: end;

  & button {
    cursor: pointer;
    background: #f8f8f8;
    margin-top: 20px;
    padding: 0 20px;
    border: none;
    height: 48px;
    font-size: 20px;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
  }

  & button.confirm {
    background-color: #3dd606;
    margin-left: 20px;
    color: #fff;
  }
`;

const WinnerListBox = styled.div`
  background: #f7f9f1;
  & .title {
    display: flex;
    justify-content: space-between;

    & h3 {
      border-radius: 10px;
      overflow: hidden;
      border: 2px solid #333333;
      height: 46px;
      box-sizing: border-box;
      & span {
        text-align: center;
        display: inline-block;
        box-sizing: content-box;
        min-width: 120px;
        padding: 8px;
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        background-color: #f7f9f1;
        color: #333333;
        cursor: pointer;

        &.active {
          color: #ffffff;
          background-color: #333333;
        }
      }
    }

    > div {
      display: flex;
      gap: 6px;
      align-items: center;
      > button {
        border-radius: 10px;
        width: 40px;
        height: 40px;

        cursor: pointer;
        &:first {
          margin: 0 10px;
        }
      }
    }
  }

  & .list {
    margin-top: 20px;
    & > div {
      font-weight: 400;
      font-size: 10px;
      line-height: 20px;
      color: #333333;
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #d9d9d9;
      &:last-child {
        border-bottom: none;
      }
      & > div {
        display: flex;
        align-items: center;
        & img {
          width: 40px;
          height: 40px;
        }

        & .index {
          width: 60px;
          margin-right: 20px;
        }

        & .name {
          width: 120px;
          margin: 0 10px;
          font-weight: 700;
          font-size: 16px;
          line-height: 20px;
          color: #333333;
        }

        & .pubkey {
          font-weight: 400;
          font-size: 16px;
          line-height: 20px;
          color: #333333;
        }
      }

      & span.index {
        height: 24px;
        font-weight: 700;
        text-align: center;
        line-height: 24px;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        text-align: center;
        display: inline-block;
        &.front-3 {
          background-image: url(${CrownImg});
        }
      }

      & span {
        font-size: 16px;
        display: flex;
        align-items: center;
        padding-right: 0;
        &:last-child {
          font-size: 14px;
          margin: 0px;
        }
      }
    }
  }
`;

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
