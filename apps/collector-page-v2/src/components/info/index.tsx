import styled from 'styled-components';
import {
  AccountType,
  getUserDisplayName,
  UserAvatar,
  useWlUserReact,
  WlUserModalType,
} from '@ecnft/wl-user-react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { sortPubKey } from '../../utils/solana';
import { Copy } from '../icons/copy';

import { Refresh } from '../icons/refresh';
import { Edit } from '../icons/edit';
import IconTwitter from '../common/icons/IconTwitter';
import IconDiscord from '../common/icons/IconDiscord';
import WalletList from './WalletList';
import AddWalletModal from './AddWalletModal';
import { ProfileWallet } from '../../services/types/profile';

export default function Info({
  nickname,
  walletAddr,
  avatar,
  date,
  wallets,
  addWallet,
  delWallet,
}: {
  nickname: string;
  walletAddr: string;
  avatar: string;
  date: number;
  wallets: ProfileWallet[];
  delWallet: (addr: string) => void;
  addWallet: (addr: string) => Promise<boolean>;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const { dispatchModal, user, authorizer, getBindAccount } = useWlUserReact();
  const nameStr = getUserDisplayName(user, authorizer);
  const twitterAccount = getBindAccount(AccountType.TWITTER);
  const discordAccount = getBindAccount(AccountType.DISCORD);
  return (
    <InfoBox>
      <div className="user-info">
        <div className="img-edit">
          <div
            onClick={() => {
              dispatchModal({ type: WlUserModalType.EDIT_PROFILE });
            }}
          >
            <Edit />
          </div>
          <UserAvatar className="user-avatar" />
        </div>

        <div className="info">
          <div className="nickname">
            <span className="name">{nameStr}</span>
            <div className="wallet">
              <WalletList
                currAddr={walletAddr}
                wallets={[{ wallet: walletAddr, chain: 'eth' }, ...wallets]}
                addAction={() => {
                  setShowAddModal(true);
                }}
                delAction={(addr) => {
                  if (addr === walletAddr) return;
                  delWallet(addr);
                }}
              />
              <span className="share">
                <Refresh />
              </span>
            </div>
          </div>
          <div className="addr">
            <span>{sortPubKey(walletAddr || '', 10)}</span>
            <span
              className="copy"
              onClick={() => {
                navigator.clipboard.writeText(walletAddr).then(
                  () => {
                    toast.success('copied');
                  },
                  (err) => {
                    console.error('Async: Could not copy text: ', err);
                  }
                );
              }}
            >
              <Copy />
            </span>
          </div>
          <div className="attach">
            <div>
              {/* <span>
                <span className="num">90</span>Following
              </span>
              <span>
                <span className="num">90</span>Follower
              </span> */}
              <span>|</span>
              <span>{dayjs(date || Date.now()).format('MMM DD YYYY')}</span>
            </div>
            <div>
              <span
                className="twitter"
                title={
                  twitterAccount
                    ? twitterAccount.thirdpartyName
                    : 'twitter unbound'
                }
              >
                <IconTwitter fill={twitterAccount ? '#FFFFFF' : '#718096'} />
              </span>
              <span
                className="discord"
                title={
                  discordAccount
                    ? discordAccount.thirdpartyName
                    : 'discord unbound'
                }
              >
                <IconDiscord fill={discordAccount ? '#FFFFFF' : '#718096'} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <AddWalletModal
        show={showAddModal}
        closeModal={() => {
          setShowAddModal(false);
        }}
        confirmAction={async (addr) => {
          const r = await addWallet(addr);
          if (r) {
            setShowAddModal(false);
          }
          return r;
        }}
      />
    </InfoBox>
  );
}

const InfoBox = styled.div`
  padding: 25px 25px 25px 20px;
  box-sizing: border-box;
  color: white;
  width: 760px;
  height: 170px;

  background: #1b1e23;
  border-radius: 20px;
  .user-info {
    display: flex;
    gap: 20px;
    & img.user-avatar {
      border-radius: 50%;

      width: 120px;
      height: 120px;
    }
    & > div.img-edit {
      position: relative;
      &:hover {
        > div {
          display: flex;
        }
      }
      > div {
        cursor: pointer;
        position: absolute;
        display: none;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.5),
          rgba(0, 0, 0, 0.5)
        );
      }
    }
    & > div.info {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      justify-content: space-between;
      & .nickname {
        display: flex;
        justify-content: space-between;
        & .name {
          font-size: 25px;
          font-weight: 700;
          font-style: italic;
          font-weight: 700;
          font-size: 24px;
          line-height: 28px;

          color: #ffffff;
        }
      }

      & .wallet {
        display: flex;
        gap: 20px;
        & > div {
          margin-top: -8px;
        }
      }
    }

    div.addr {
      display: flex;
      gap: 5px;
      color: #718096;
      align-items: center;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      & .copy {
        cursor: pointer;
      }
    }

    & .share {
      cursor: pointer;
    }
  }

  .attach {
    display: flex;

    justify-content: space-between;
    align-items: center;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height, or 150% */

    /* #718096 */

    color: #718096;
    > div {
      display: flex;
      gap: 10px;
    }

    & .num {
      line-height: 19px;
      color: #ffffff;
      margin-right: 5px;
    }

    & .twitter,
    & .discord {
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #14171a;
    }
    & .discord {
      /* background: #14171a; */
    }
  }
`;
