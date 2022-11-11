/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-10 19:25:54
 * @Description: file description
 */
import React, { ButtonHTMLAttributes, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AuthActionProcessStatus, AuthorizerType } from '../authorizers';
import { useWlUserReact, WlUserActionType } from '../provider';
import { ButtonPrimary } from './common/button/ButtonBase';

export type LoginWithAuthorizerButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    authorizerType: AuthorizerType;
  };

const LoginWithAuthorizerButton: React.FC<LoginWithAuthorizerButtonProps> = ({
  children,
  authorizerType,
  ...otherProps
}: LoginWithAuthorizerButtonProps) => {
  const { getAuthorizer, isLogin } = useWlUserReact();
  const authorizer = getAuthorizer(authorizerType);
  if (!authorizer) throw Error(`${authorizerType} authorizer not found`);
  const { name, bgColor, iconUrl, nameColor } = authorizer;
  const [loading, setLoading] = useState(false);
  authorizer.action.loginListener({
    process: (status) =>
      setLoading(
        [
          AuthActionProcessStatus.SIGNATURE_PENDING,
          AuthActionProcessStatus.API_PENDING,
        ].includes(status)
      ),
  });
  return (
    <LoginWithAuthorizerButtonWrapper
      onClick={() => authorizer.action.login()}
      disabled={(isLogin && authorizer.type === authorizerType) || loading}
      bgColor={bgColor}
      {...otherProps}
    >
      <AuthorizerIcon
        src={iconUrl}
        className="wl-user-button-login_authorizer-icon"
      />

      <AuthorizerButtonName
        color={nameColor}
        className="wl-user-button-login_authorizer-name"
      >
        {loading ? 'Logging ...' : name}
      </AuthorizerButtonName>
    </LoginWithAuthorizerButtonWrapper>
  );
};
export default LoginWithAuthorizerButton;

const LoginWithAuthorizerButtonWrapper = styled(ButtonPrimary)<{
  bgColor: string;
}>`
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background-color: ${({ bgColor }) => bgColor};
`;
const AuthorizerIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;
const AuthorizerButtonName = styled.span<{ color: string }>`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: ${({ color }) => color};
`;
