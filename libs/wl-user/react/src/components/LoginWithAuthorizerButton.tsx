/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 14:31:37
 * @Description: file description
 */
import { useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { AuthorizerActionProcessStatus, AuthorizerType } from '../authorizers';
import { useWlUserReact } from '../hooks';
import { createClassNamesByTheme } from '../utils/style';
import { ButtonPrimary } from './common/button/ButtonBase';

export type LoginWithAuthorizerButtonProps =
  StyledComponentPropsWithRef<'button'> & {
    authorizerType: AuthorizerType;
  };

function LoginWithAuthorizerButton({
  children,
  authorizerType,
  ...otherProps
}: LoginWithAuthorizerButtonProps) {
  const { getAuthorizer, isLogin, theme } = useWlUserReact();
  const authorizer = getAuthorizer(authorizerType);
  if (!authorizer) throw Error(`${authorizerType} authorizer not found`);
  const { name, bgColor, iconUrl, nameColor } = authorizer;
  const [loading, setLoading] = useState(false);
  authorizer.action.loginListener({
    process: (status) =>
      setLoading(
        [
          AuthorizerActionProcessStatus.SIGNATURE_PENDING,
          AuthorizerActionProcessStatus.API_PENDING,
        ].includes(status)
      ),
  });
  return (
    <LoginWithAuthorizerButtonWrapper
      className={createClassNamesByTheme(
        'wl-user-button-login_authorizer',
        theme
      )}
      onClick={() => authorizer.action.login()}
      disabled={(isLogin && authorizer.type === authorizerType) || loading}
      bgColor={bgColor}
      {...otherProps}
    >
      <AuthorizerIcon src={iconUrl} className="authorizer-icon" />

      <AuthorizerButtonName color={nameColor} className="authorizer-name">
        {loading ? 'Logging ...' : name}
      </AuthorizerButtonName>
    </LoginWithAuthorizerButtonWrapper>
  );
}
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
`;
const AuthorizerButtonName = styled.span<{ color: string }>`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: ${({ color }) => color};
`;
