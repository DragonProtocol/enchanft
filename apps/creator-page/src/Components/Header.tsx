import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { AppProvider, useAppConfig } from '../AppProvider';
import ConnectModal from './ConnectModal';
import Logo from './imgs/logo.png';
import ULImg from './imgs/ul.svg';

export default function Header() {
  const { phantomValid, metaMaskValid } = useAppConfig();

  const [showCommunityList, setShowCommunityList] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const windowClick = (e: MouseEvent) => {
      setShowCommunityList(false);
    };
    window.addEventListener('click', windowClick);
    return () => {
      window.removeEventListener('click', windowClick);
    };
  });

  return (
    <>
      <HeaderBox>
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>CREATOR</span>
        </div>
        <div className="btns">
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
                <div>+ add</div>
                <div>+ add</div>
                <div>+ add</div>
              </div>
            )}
          </div>
          <button
            className="connect-btn"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Connect Wallet
          </button>
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
    & .connect-btn {
      cursor: pointer;
      width: 200px;
      height: 48px;
      right: 40px;
      top: 12px;
      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      margin-left: 20px;

      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #ffffff;
    }
  }
`;
