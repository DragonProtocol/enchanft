/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 14:36:31
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-30 12:03:21
 * @Description: file description
 */
import { UserAvatar, getUserDisplayName } from '@ecnft/wl-user-react';
import styled from 'styled-components';
import useLogin from '../../hooks/useLogin';
import LogoutSvg from '../common/icons/svgs/logout.svg';

type Props = {
  onlyIcon?: boolean;
};
export default function LoginButton({ onlyIcon }: Props) {
  const { authorizer, user, isLogin, login, logout } = useLogin();
  const nameStr = authorizer && getUserDisplayName(user, authorizer);
  return (
    <LoginButtonWrapper
      hiddenStyle={onlyIcon}
      onClick={() => {
        if (!isLogin) {
          login();
        } else {
          logout();
        }
      }}
    >
      <LoginButtonBody className="wl-user-button_login-body">
        {isLogin ? (
          <>
            <LoginButtonAvatar className="wl-user-button_login-avatar" />
            {!onlyIcon && (
              <>
                <LoginButtonName className="wl-user-button_login-name">
                  {nameStr}
                </LoginButtonName>
                <LogoutIconButton src={LogoutSvg} />
              </>
            )}
          </>
        ) : (
          <LoginButtonName className="wl-user-button_login-name">
            Login
          </LoginButtonName>
        )}
      </LoginButtonBody>
    </LoginButtonWrapper>
  );
}

const LoginButtonWrapper = styled.div<{ hiddenStyle?: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  gap: 4px;
  isolation: isolate;

  height: 48px;

  border: 1px solid #39424c;
  border-radius: 12px;
  cursor: pointer;
  ${({ hiddenStyle }) =>
    hiddenStyle &&
    `
    padding: 0;
    border: none;
  `}
  transition: all 0.3s ease-out;
`;
const LoginButtonBody = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const LoginButtonAvatar = styled(UserAvatar)`
  width: 24px;
  height: 24px;
  border-radius: 20px;
`;
const LoginButtonName = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
`;
const LogoutIconButton = styled.img`
  width: 24px;
  height: 24px;
`;
