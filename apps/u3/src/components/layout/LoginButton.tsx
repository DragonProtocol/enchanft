/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 14:36:31
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-13 10:23:37
 * @Description: file description
 */
import { UserAvatar, getUserDisplayName } from '@ecnft/wl-user-react';
import styled from 'styled-components';
import useLogin from '../../hooks/useLogin';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import LogoutSvg from '../common/icons/svgs/logout.svg';

type Props = {
  onlyIcon?: boolean;
  onLogout?: () => void;
  karmaScore?: number;
};
export default function LoginButton({ onlyIcon, onLogout, karmaScore }: Props) {
  const { authorizer, user, isLogin, login, logout } = useLogin();
  const nameStr = authorizer && getUserDisplayName(user, authorizer);
  return (
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
            <LoginButtonAvatar className="wl-user-button_login-avatar" />
            {(!onlyIcon && (
              <>
                <LoginButtonName className="wl-user-button_login-name">
                  {nameStr}
                </LoginButtonName>
                <LogoutIconButton src={LogoutSvg} />
              </>
            )) || (
              <div className="score">
                <span>{karmaScore || 0}</span>
                <span className="triangle" />
              </div>
            )}
          </>
        ) : (
          <NoLoginText className="wl-user-button_no-login-text">
            Login
          </NoLoginText>
        )}
      </LoginButtonBody>
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
  & .score {
    position: absolute;
    top: -30px;
    padding: 2px 4px;
    box-sizing: border-box;

    width: 40px;
    height: 18px;

    background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
    border-radius: 22px;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;

    color: #ffffff;

    & .triangle {
      z-index: -1;
      position: absolute;
      left: 17px;
      bottom: -2px;
      width: 7px;
      height: 7px;

      background: linear-gradient(12.42deg, #cd62ff 35.31%, #62aaff 89.64%);
      transform: rotate(120deg) skewX(-30deg) scale(1, 0.866);
      border-top-right-radius: 30%;
    }
  }
`;
const LoginButtonAvatar = styled(UserAvatar)`
  width: 24px;
  height: 24px;
  border-radius: 20px;
`;
const LoginButtonName = styled.span`
  flex: 1;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
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
