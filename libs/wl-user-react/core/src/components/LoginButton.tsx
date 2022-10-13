/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 14:40:05
 * @Description: file description
 */
import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { useWlUserReact } from '../provider';
import UserAvatar from './common/avatar/UserAvatar';
import { ButtonPrimary } from './common/button/ButtonBase';

export type LoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const LoginButton: React.FC<LoginButtonProps> = ({
  children,
  ...otherProps
}: LoginButtonProps) => {
  const { signer, user, isLogin } = useWlUserReact();
  return (
    <LoginButtonWrapper {...otherProps}>
      <LoginButtonBody className="wl-user-button_login-body">
        {children || (
          <>
            <LoginButtonAvatar
              src={user.avatar}
              multiavatarId={'wl_user_id_' + user.id}
              className="wl-user-button_login-avatar"
            />
          </>
        )}
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
`;
const LoginButtonAvatar = styled(UserAvatar)`
  width: 25px;
  margin-right: 10px;
  font-size: 15px;
`;
const LoginButtonName = styled.span``;
