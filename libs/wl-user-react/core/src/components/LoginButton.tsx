/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 21:58:22
 * @Description: file description
 */
import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { useWlUserReact } from '../provider';
import { getUserDisplayName, SignerAccountTypeMap } from '../utils';
import UserAvatar from './common/avatar/UserAvatar';
import { ButtonPrimary } from './common/button/ButtonBase';

export type LoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const LoginButton: React.FC<LoginButtonProps> = ({
  children,
  onClick,
  ...otherProps
}: LoginButtonProps) => {
  const { signer, user, isLogin } = useWlUserReact();
  const nameStr = signer && getUserDisplayName(user, signer.signerType);
  return (
    <LoginButtonWrapper {...otherProps}>
      <LoginButtonBody className="wl-user-button_login-body">
        {children ||
          (isLogin ? (
            <>
              <LoginButtonAvatar
                src={user.avatar}
                multiavatarId={'wl_user_id_' + user.id}
                className="wl-user-button_login-avatar"
              />
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
};
export default LoginButton;

const LoginButtonWrapper = styled(ButtonPrimary)`
  width: 200px;
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
