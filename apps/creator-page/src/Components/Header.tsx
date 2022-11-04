import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAppConfig } from '../AppProvider';
import { fetchProjectList, selectProjectList } from '../redux/projectListSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

import IconPlus from './Icons/IconPlus';
import Logo from './imgs/logo.png';
import ULImg from './imgs/ul.svg';

import {
  useWlUserReact,
  LoginButton,
  WlUserModalType,
  WlUserActionType,
} from '@ecnft/wl-user-react';

export default function Header() {
  const { account, validLogin, updateAccount, isAdmin } = useAppConfig();

  const navigate = useNavigate();
  const [showProjectList, setShowProjectList] = useState(false);
  const [showLoginInfo, setShowLoginInfo] = useState(false);

  const dispatch = useAppDispatch();
  const { data: projectList } = useAppSelector(selectProjectList);

  const { isLogin, dispatchModal, dispatchAction } = useWlUserReact();

  useEffect(() => {
    if (!validLogin) return;
    dispatch(fetchProjectList({ token: account.info?.token! }));
  }, [account.info?.token, dispatch, validLogin]);

  useEffect(() => {
    const windowClick = (e: MouseEvent) => {
      setShowProjectList(false);
      setShowLoginInfo(false);
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
          <span onClick={() => navigate('/')}>CREATOR</span>
        </div>
        <div className="btns">
          {validLogin && (
            <div className="community-box" onClick={(e) => e.stopPropagation()}>
              <button
                title="community-btn"
                className="community-btn"
                onClick={(e) => {
                  setShowProjectList(!showProjectList);
                }}
              >
                <img src={ULImg} alt="" />
              </button>
              {showProjectList && (
                <div className="community-list">
                  {isAdmin && (
                    <div
                      className="community-item"
                      onClick={() => navigate('/project/new')}
                    >
                      <IconPlus size="16px" /> Create Project
                    </div>
                  )}
                  {projectList?.map((item) => {
                    return (
                      <div
                        className="community-item"
                        key={item.id}
                        onClick={() => {
                          navigate(`/project/${item.slug}/detail`);
                        }}
                      >
                        <img src={item.image} alt="" />
                        <span>{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          <div className="connect-box" onClick={(e) => e.stopPropagation()}>
            <LoginButton
              onClick={() =>
                isLogin
                  ? setShowLoginInfo(true)
                  : dispatchModal({ type: WlUserModalType.LOGIN })
              }
            />
            {showLoginInfo && isLogin && (
              <div className="connect-list">
                <button
                  onClick={() => {
                    dispatchAction({ type: WlUserActionType.LOGOUT });
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </HeaderBox>
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
        z-index: 100;
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

          & span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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
        background: #f7f9f1;
        width: 100%;
        position: absolute;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
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
