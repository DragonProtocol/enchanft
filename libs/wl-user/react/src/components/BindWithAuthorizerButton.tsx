/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-17 16:45:39
 * @Description: file description
 */
import React, { ButtonHTMLAttributes, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AuthorizerActionProcessStatus, AuthorizerType } from '../authorizers';
import { WlUserModalType } from '../contexts/wlUserReact';
import { useWlUserReact } from '../hooks';
import { getAccountDisplayName } from '../utils';
import ButtonBase from './common/button/ButtonBase';
import IconUnlink from './common/icons/IconUnlink';

export type BindWithAuthorizerButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    authorizerType: AuthorizerType;
  };

const BindWithAuthorizerButton: React.FC<BindWithAuthorizerButtonProps> = ({
  children,
  authorizerType,
  ...otherProps
}: BindWithAuthorizerButtonProps) => {
  const { getAuthorizer, user, isLogin, validateBindAccount, dispatchModal } =
    useWlUserReact();
  const authorizer = getAuthorizer(authorizerType);
  if (!authorizer) throw Error(`${authorizerType} authorizer not found`);
  const { name, bgColor, iconUrl, nameColor } = authorizer;
  const isBind = validateBindAccount(authorizer.accountType);
  const nameStr = isBind
    ? getAccountDisplayName(user, authorizer)
    : `Bind ${name}`;
  const [loading, setLoading] = useState(false);
  authorizer.action.bindListener({
    process: (status: AuthorizerActionProcessStatus) =>
      setLoading(
        [
          AuthorizerActionProcessStatus.SIGNATURE_PENDING,
          AuthorizerActionProcessStatus.API_PENDING,
        ].includes(status)
      ),
  });

  return (
    <BindWithAuthorizerButtonWrapper
      bgColor={bgColor}
      disabled={!isLogin || loading}
      onClick={() => !isBind && authorizer.action.bind(user.token)}
      {...otherProps}
    >
      <AuthorizerIcon
        src={iconUrl}
        className="wl-user-button-bind_authorizer-icon"
      />

      <AuthorizerName
        color={nameColor}
        className="wl-user-button-bind_authorizer-name"
      >
        {loading ? 'Binding ...' : nameStr}
      </AuthorizerName>
      {isBind && (
        <AuthorizerUnbindBox
          color={nameColor}
          onClick={(e: any) => {
            e.stopPropagation();
            dispatchModal({
              type: WlUserModalType.UNBIND_CONFIRM,
              payload: authorizerType,
            });
          }}
        >
          <IconUnlink size="1.2rem" />
        </AuthorizerUnbindBox>
      )}
    </BindWithAuthorizerButtonWrapper>
  );
};
export default BindWithAuthorizerButton;

const BindWithAuthorizerButtonWrapper = styled(ButtonBase)<{ bgColor: string }>`
  height: 40px;
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
const AuthorizerName = styled.span<{ color: string }>`
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: ${({ color }) => color};
`;

const AuthorizerUnbindBox = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  padding-left: 5px;
  border-left: 1px solid rgba(255, 255, 255, 0.4);
  color: ${({ color }) => color};
`;
