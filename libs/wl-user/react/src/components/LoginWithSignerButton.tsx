/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-25 19:27:53
 * @Description: file description
 */
import React, { ButtonHTMLAttributes, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useWlUserReact, WlUserActionType } from '../provider';
import { SignerProcessStatus, SignerType } from '@ecnft/wl-user-core';
import { validateSignerPending } from '../utils';
import { ButtonPrimary } from './common/button/ButtonBase';
import { SignerStyleMap } from './signerStyle';

export type LoginWithSignerButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    signerType: SignerType;
  };

const LoginWithSignerButton: React.FC<LoginWithSignerButtonProps> = ({
  children,
  signerType,
  ...otherProps
}: LoginWithSignerButtonProps) => {
  const signerStyle = SignerStyleMap[signerType];
  const { isLogin, signer, dispatchAction, userActionState } = useWlUserReact();
  const isLoading = useMemo(() => {
    const { type, signer, processStatus } = userActionState;
    return (
      type === WlUserActionType.LOGIN &&
      signer?.signerType === signerType &&
      validateSignerPending(signerType, processStatus as SignerProcessStatus)
    );
  }, [signerType, userActionState]);
  return (
    <LoginWithSignerButtonWrapper
      onClick={() =>
        dispatchAction({
          type: WlUserActionType.LOGIN,
          payload: signerType,
        })
      }
      disabled={(isLogin && signer?.signerType === signerType) || isLoading}
      bgColor={signerStyle.bgColor}
      {...otherProps}
    >
      <SignerSignerButtonIconBox className="wl-user-button-login_signer-icon-box">
        {signerStyle.icon}
      </SignerSignerButtonIconBox>

      <SignerButtonName
        color={signerStyle.nameColor}
        className="wl-user-button-login_signer-name"
      >
        {isLoading ? 'Logging ...' : signerStyle.name}
      </SignerButtonName>
    </LoginWithSignerButtonWrapper>
  );
};
export default LoginWithSignerButton;

const LoginWithSignerButtonWrapper = styled(ButtonPrimary)<{
  bgColor: string;
}>`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background-color: ${({ bgColor }) => bgColor};
`;
const SignerSignerButtonIconBox = styled.div`
  width: 24px;
  height: 24px;
`;
const SignerButtonName = styled.span<{ color: string }>`
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: ${({ color }) => color};
`;
