/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 14:36:31
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-08 16:44:26
 * @Description: file description
 */
import { UserAvatar } from '@us3r-network/authkit';
import { useUs3rProfileContext } from '@us3r-network/profile';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useLogin from '../../hooks/useLogin';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import LogoutSvg from '../common/icons/svgs/logout.svg';
import { Atom2 } from '../icons/atom';

// TODO 从authkit中导出
export const getUserDisplayName = (
  sessId: string,
  profile?:
    | {
        name: string;
      }
    | undefined
) => {
  if (profile && profile.name) {
    return profile.name;
  }
  return sessId ? `${sessId.slice(0, 8)}..${sessId.slice(-4)}` : '';
};

type Props = {
  onlyIcon?: boolean;
  onLogout?: () => void;
  karmaScore?: number;
};
export default function LoginButton({ onlyIcon, onLogout, karmaScore }: Props) {
  const { sessId, profile } = useUs3rProfileContext();
  const { authorizer, user, isLogin, login } = useLogin();
  const preScore = useRef<number>(karmaScore || 0);
  const nameStr = authorizer && getUserDisplayName(sessId, profile);
  const [diffScore, setDiffScore] = useState(0);
  const navigate = useNavigate();
  const flowerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (preScore.current === 0) {
      preScore.current = karmaScore || 0;
      return;
    }
    const diff = (karmaScore || 0) - preScore.current;
    if (diff > 0) {
      setDiffScore(diff);
      const flowerScore = document.getElementById('flower-score');
      const flowerScoreNumber = document.getElementById('flower-score-num');

      if (!flowerScore || !flowerScoreNumber) return;
      flowerScore.style.transition = 'none';
      flowerScore.style.opacity = '1';
      flowerScoreNumber.style.transition = 'none';
      flowerScoreNumber.style.transform = 'translateY(0px)';
      setTimeout(() => {
        flowerScore.style.transition = 'all 0.5s ease-out';
        flowerScore.style.opacity = '0';
        flowerScoreNumber.style.transition = 'all 0.3s ease-out';
        flowerScoreNumber.style.transform = 'translateY(-5px)';
      }, 300);
    }
    preScore.current = karmaScore || 0;
  }, [karmaScore, preScore]);

  const showScore = karmaScore > 0 ? `${karmaScore}` : '';

  return (
    <LoginButtonWrapper
      hiddenStyle={onlyIcon}
      onClick={() => {
        if (!isLogin) {
          login();
        }
      }}
    >
      {isLogin ? (
        <>
          <UserAvatar
            className="wl-user-button_login-avatar"
            onClick={() => {
              navigate('/profile');
            }}
          />
          {!onlyIcon && (
            <>
              <LoginButtonName
                className="wl-user-button_login-name"
                onClick={() => {
                  navigate('/profile');
                }}
                title={nameStr}
              >
                {nameStr}
              </LoginButtonName>
              <LogoutIconButton src={LogoutSvg} onClick={onLogout} />
            </>
          )}
          {showScore && (
            <ScoreBox onlyIcon>
              <span className="triangle" />
              {!onlyIcon && (
                <>
                  <Atom2 />
                  <span>U Karma</span>
                </>
              )}
              <span>{showScore}</span>

              <div id="flower-score" className="flower show" ref={flowerRef}>
                <span />
                <span className="score-add" id="flower-score-num">
                  +{diffScore}
                </span>
                <span />
              </div>
            </ScoreBox>
          )}
        </>
      ) : (
        <NoLoginText className="wl-user-button_no-login-text">
          Login
        </NoLoginText>
      )}
    </LoginButtonWrapper>
  );
}

const LoginButtonWrapper = styled(ButtonPrimaryLine)<{ hiddenStyle?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 10px;
  isolation: isolate;
  ${({ hiddenStyle }) =>
    hiddenStyle &&
    `
    padding: 0;
    border: none;
  `}
  transition: all 0.3s ease-out;
  position: relative;

  .wl-user-button_login-avatar {
    width: 40px;
    height: 40px;
  }
`;

const ScoreBox = styled.div<{ onlyIcon: boolean }>`
  position: absolute;
  top: -10px;
  transform: translateY(-100%);
  box-sizing: border-box;

  width: 100%;
  height: 23px;

  background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
  border-radius: 22px;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;

  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  & .triangle {
    z-index: -1;
    position: absolute;
    left: 50%;
    bottom: -2px;
    width: 7px;
    height: 7px;
    transition: all 0.2s ease-out;
    background: linear-gradient(12.42deg, #cd62ff 35.31%, #62aaff 89.64%);
    transform: translateX(calc(-50%)) rotate(120deg) skewX(-30deg)
      scale(1, 0.866);
    border-top-right-radius: 30%;
  }

  & .karma {
    display: flex;
    align-items: center;
  }

  & .flower {
    position: absolute;
    top: -18px;
    width: 100%;
    left: 0;
    opacity: 0;
    & .score-add {
      display: inline-block;
      color: #ffffff;
    }

    & span:last-child,
    & span:first-child {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 1px;
      height: 5px;
      background: linear-gradient(12.42deg, #cd62ff 35.31%, #62aaff 89.64%);
      transform: rotate(35deg);
    }
    & span:first-child {
      left: 0;
      transform: rotate(-35deg);
    }
  }
`;

const LoginButtonName = styled.span`
  /* flex: 1; */
  text-align: center;
  font-weight: 400;
  line-height: 17px;
  text-align: center;

  color: #718096;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const LogoutIconButton = styled.img`
  width: 24px;
  height: 24px;
`;

const NoLoginText = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
`;

const KarmaWrapper = styled(ButtonPrimaryLine)`
  padding: 12px 10px;
  height: 72px;
  gap: 8px;
  width: 100%;
  isolation: isolate;
  display: flex;
  margin-bottom: 10px;
  background: #1a1e23;
  justify-content: start;
  border: 1px solid #39424c;
  border-radius: 12px;
  color: #ffffff;
  & .user-avatar {
    width: 48px;
    height: 48px;
  }

  > div {
    text-align: start;
  }

  & .user-name {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;

    color: #ffffff;
  }
  & .karma {
    display: flex;
    padding: 2px 8px;
    box-sizing: border-box;
    gap: 4px;
    align-items: center;
    height: 21px;
    width: fit-content;

    background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
    border-radius: 22px;

    & span {
      flex: 1;
      text-align: center;
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      color: #ffffff;
    }
  }
`;
