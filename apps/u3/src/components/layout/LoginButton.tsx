/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 14:36:31
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-13 10:23:37
 * @Description: file description
 */
import { UserAvatar, getUserDisplayName } from '@ecnft/wl-user-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useLogin from '../../hooks/useLogin';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import LogoutSvg from '../common/icons/svgs/logout.svg';
import { Atom2 } from '../icons/atom';

type Props = {
  onlyIcon?: boolean;
  onLogout?: () => void;
  karmaScore?: number;
};
export default function LoginButton({ onlyIcon, onLogout, karmaScore }: Props) {
  const { authorizer, user, isLogin, login } = useLogin();
  const preScore = useRef<number>(karmaScore || 0);
  const nameStr = authorizer && getUserDisplayName(user, authorizer);
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
    <>
      {isLogin && !onlyIcon && (
        <KarmaWrapper
          onClick={() => {
            navigate('/profile');
          }}
        >
          <UserAvatar className="user-avatar" />
          <div>
            <span className="user-name">{nameStr}</span>
            <div className="karma">
              <Atom2 />
              <span>{showScore}</span>
            </div>
          </div>
        </KarmaWrapper>
      )}

      <LoginButtonWrapper
        hiddenStyle={onlyIcon}
        onClick={() => {
          if (!isLogin) {
            login();
          } else {
            onLogout();
          }
        }}
      >
        <LoginButtonBody className="wl-user-button_login-body">
          {isLogin ? (
            <>
              {(onlyIcon && (
                <LoginButtonAvatar className="wl-user-button_login-avatar" />
              )) || (
                <>
                  <LoginButtonName className="wl-user-button_login-name">
                    Logout
                  </LoginButtonName>
                  <LogoutIconButton src={LogoutSvg} />
                </>
              )}
              {onlyIcon && showScore && (
                <ScoreBox onlyIcon>
                  <span className="triangle" />

                  <span>{showScore}</span>

                  <div
                    id="flower-score"
                    className="flower show"
                    ref={flowerRef}
                  >
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
        </LoginButtonBody>
      </LoginButtonWrapper>
    </>
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
  gap: 4px;
  isolation: isolate;
  ${({ hiddenStyle }) =>
    hiddenStyle &&
    `
    padding: 0;
    border: none;
  `}
  transition: all 0.3s ease-out;
`;
const LoginButtonBody = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
`;
const ScoreBox = styled.div<{ onlyIcon: boolean }>`
  position: absolute;
  top: ${({ onlyIcon }) => (onlyIcon ? '-30px' : '-43px')};
  padding: ${({ onlyIcon }) => (onlyIcon ? '2px 0 2px 0' : '0px')};
  box-sizing: border-box;

  width: ${({ onlyIcon }) => (onlyIcon ? '40px' : '130px')};
  height: ${({ onlyIcon }) => (onlyIcon ? '18px' : '23px')};

  background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
  border-radius: 22px;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;

  color: #ffffff;

  & .triangle {
    z-index: -1;
    position: absolute;
    left: ${({ onlyIcon }) => (onlyIcon ? '17px' : '60px')};
    bottom: -2px;
    width: 7px;
    height: 7px;
    transition: all 0.2s ease-out;
    background: linear-gradient(12.42deg, #cd62ff 35.31%, #62aaff 89.64%);
    transform: rotate(120deg) skewX(-30deg) scale(1, 0.866);
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

const LoginButtonAvatar = styled(UserAvatar)`
  width: 24px;
  height: 24px;
  border-radius: 20px;
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
    width: 42px;
    height: 42px;
  }

  > div {
    text-align: start;
  }

  & .user-name {
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    text-align: center;

    color: #ffffff;
  }
  & .karma {
    display: flex;
    padding: 2px 8px;
    gap: 4px;
    align-items: center;
    height: 21px;
    width: fit-content;

    background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
    border-radius: 22px;

    & span {
      flex: 1;
      text-align: center;
    }
  }
`;
