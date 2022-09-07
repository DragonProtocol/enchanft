import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAppConfig } from '../AppProvider';
import { LAST_LOGIN_PUBKEY, LAST_LOGIN_TOKEN } from '../utils/token';
import ConnectModal from './ConnectModal';
import IconPlus from './Icons/IconPlus';
import Logo from './imgs/logo.png';
import ULImg from './imgs/ul.svg';
import UserAvatar from './UserAvatar';

export default function Header() {
  const { account, validLogin, updateAccount } = useAppConfig();

  const navigate = useNavigate();
  const [showCommunityList, setShowCommunityList] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginInfo, setShowLoginInfo] = useState(false);

  useEffect(() => {
    const windowClick = (e: MouseEvent) => {
      setShowCommunityList(false);
      setShowLoginInfo(false);
    };
    window.addEventListener('click', windowClick);
    return () => {
      window.removeEventListener('click', windowClick);
    };
  });

  const shortPubkey = useMemo(() => {
    if (account.info?.pubkey) {
      return (
        account.info.pubkey.slice(0, 4) + '..' + account.info.pubkey.slice(-4)
      );
    }
    return '';
  }, [account.info?.pubkey]);

  return (
    <>
      <HeaderBox>
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span onClick={() => navigate('/')}>CREATOR</span>
        </div>
        <div className="btns">
          {validLogin && (
            <div className="community-box" onClick={(e) => e.stopPropagation()}>
              <button
                title="community-btn"
                className="community-btn"
                onClick={(e) => {
                  setShowCommunityList(true);
                }}
              >
                <img src={ULImg} alt="" />
              </button>
              {showCommunityList && (
                <div className="community-list">
                  <div
                    className="community-item"
                    onClick={() => navigate('/project/new')}
                  >
                    <IconPlus size="16px" /> Create Project
                  </div>
                  <div className="community-item">
                    <img
                      src="https://ihsjifyh373rbw4xqsbf4u5gcj6rhojof47a25npn7cez47o7z4q.arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk"
                      alt=""
                    />
                    <span>One Piece</span>
                  </div>
                  <div className="community-item">
                    <img
                      src="https://ihsjifyh373rbw4xqsbf4u5gcj6rhojof47a25npn7cez47o7z4q.arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk"
                      alt=""
                    />
                    <span>One Piece</span>
                  </div>
                  <div className="community-item">
                    <img
                      src="https://ihsjifyh373rbw4xqsbf4u5gcj6rhojof47a25npn7cez47o7z4q.arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk"
                      alt=""
                    />
                    <span>One Piece</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="connect-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="connect-btn"
              onClick={() => {
                if (!validLogin) {
                  setShowModal(true);
                } else {
                  setShowLoginInfo(true);
                }
              }}
            >
              {(validLogin && (
                <>
                  <UserAvatar src={account.info?.avatar} />
                  {account.info?.name || shortPubkey}
                </>
              )) ||
                'Connect Wallet'}
            </button>
            {showLoginInfo && validLogin && (
              <div className="connect-list">
                <button
                  onClick={() => {
                    localStorage.setItem(LAST_LOGIN_TOKEN, '');
                    localStorage.setItem(LAST_LOGIN_PUBKEY, '');
                    updateAccount({
                      ...account,
                      info: {},
                    });
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </HeaderBox>
      <ConnectModal
        show={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}

const HeaderBox = styled.header`
  padding: 0 40px;
  display: flex;
  height: 72px;
  align-items: center;
  justify-content: space-between;
  background: #f7f9f1;
  text-align: center;
  & .logo {
    height: 24px;
    display: inline-flex;
    align-items: center;

    & span {
      cursor: pointer;
      margin-left: 20px;
      width: 77px;
      height: 20px;
      background: #afff93;
      border-radius: 10px;
      font-weight: 700;
      font-size: 12px;
      line-height: 18px;
      text-transform: uppercase;
      color: #333333;
    }
  }

  & .btns {
    display: inline-flex;
    & .community-box {
      position: relative;
      & .community-list {
        position: absolute;
        right: 0;
        top: 60px;
        width: 268px;
        background: #f7f9f1;
        border: 4px solid #333333;
        box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
        border-radius: 20px;
        box-sizing: border-box;
        padding: 5px;

        & .community-item {
          padding: 0px 10px 0 15px;
          height: 48px;
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 700;
          font-size: 16px;
          line-height: 24px;
          display: flex;
          align-items: center;
          color: #333333;
          & svg,
          & img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
      }
    }
    & .community-btn {
      width: 48px;
      height: 48px;
      right: 260px;
      top: 12px;
      cursor: pointer;
      background: #ebeee4;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }
    & .connect-box {
      position: relative;
      margin-left: 20px;
      & .connect-list {
        background: #fff;
        width: 100%;
        position: absolute;
        & button {
          height: 35px;
        }
      }
    }
    & .connect-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      text-align: center;
      padding: 16px 18px;
      height: 48px;
      right: 40px;
      top: 12px;
      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;

      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #ffffff;

      & img {
        width: 25px;
        margin-right: 10px;
        font-size: 15px;
      }
    }
  }
`;
