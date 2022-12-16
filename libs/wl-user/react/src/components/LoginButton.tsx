/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-16 17:58:41
 * @Description: file description
 */
import React, { ButtonHTMLAttributes, useCallback } from 'react';
import styled from 'styled-components';
import { getUserDisplayName } from '../utils';
import UserAvatar from './UserAvatar';
import { ButtonPrimary } from './common/button/ButtonBase';
import { WlUserModalType } from '../contexts/wlUserReact';
import { useWlUserReact } from '../hooks';
import { createClassNamesByTheme } from '../utils/style';

export type LoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function LoginButton({ children, onClick, ...otherProps }: LoginButtonProps) {
  const { authorizer, user, isLogin, dispatchModal, theme } = useWlUserReact();
  const nameStr = authorizer && getUserDisplayName(user, authorizer);
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (onClick) {
        onClick(e);
      } else {
        dispatchModal({
          type: WlUserModalType.LOGIN,
        });
      }
    },
    [onClick, dispatchModal]
  );
  return (
    <LoginButtonWrapper
      onClick={handleClick}
      className={createClassNamesByTheme('wl-user-button_login', theme)}
      {...otherProps}
    >
      <LoginButtonBody className="wl-user-button_login-body">
        {children ||
          (isLogin ? (
            <>
              <LoginButtonAvatar className="wl-user-button_login-avatar" />
              <LoginButtonName className="wl-user-button_login-name">
                {nameStr}
              </LoginButtonName>
            </>
          ) : (
            'Login'
          ))}
      </LoginButtonBody>
    </LoginButtonWrapper>
  );
}
export default LoginButton;

const LoginButtonWrapper = styled(ButtonPrimary)`
  height: 48px;
`;
const LoginButtonBody = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const LoginButtonAvatar = styled(UserAvatar)`
  width: 25px;
  font-size: 15px;
`;
const LoginButtonName = styled.span``;
