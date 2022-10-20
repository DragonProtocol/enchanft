/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-20 11:08:44
 * @Description: file description
 */
import React, { ButtonHTMLAttributes, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useWlUserReact, WlUserActionType, WlUserModalType } from '../provider';
import { SignerType } from '../signer/types';
import { getAccountDisplayName, volidSignerPending } from '../utils';
import ButtonBase from './common/button/ButtonBase';
import IconUnlink from './common/icons/IconUnlink';
import { SignerStyleMap } from './signerStyle';

export type BindWithSignerButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    signerType: SignerType;
  };

const BindWithSignerButton: React.FC<BindWithSignerButtonProps> = ({
  children,
  signerType,
  ...otherProps
}: BindWithSignerButtonProps) => {
  const {
    getSigner,
    user,
    isLogin,
    volidBindAccount,
    dispatchAction,
    dispatchModal,
    userActionState,
  } = useWlUserReact();

  const signer = getSigner(signerType);
  const signerStyle = SignerStyleMap[signerType];
  const isBind = signer && volidBindAccount(signer.accountType);
  const nameStr = isBind
    ? getAccountDisplayName(user, signerType)
    : `Bind ${signerStyle.name}`;
  const isLoading = useMemo(() => {
    const { type, signer, processStatus } = userActionState;
    return (
      type === WlUserActionType.BIND &&
      signer?.signerType === signerType &&
      volidSignerPending(signerType, processStatus)
    );
  }, [signerType, userActionState]);

  const unbindDisplay =
    isBind && [SignerType.TWITTER, SignerType.DISCORD].includes(signerType);
  return (
    <BindWithSignerButtonWrapper
      bgColor={signerStyle.bgColor}
      disabled={!isLogin || isLoading}
      onClick={() =>
        !isBind &&
        dispatchAction({
          type: WlUserActionType.BIND,
          payload: signerType,
        })
      }
      {...otherProps}
    >
      <SignerButtonIconBox className="wl-user-button-bind_signer-icon-box">
        {signerStyle.icon}
      </SignerButtonIconBox>

      <SignerButtonName
        color={signerStyle.nameColor}
        className="wl-user-button-bind_signer-name"
      >
        {isLoading ? 'Binding ...' : nameStr}
      </SignerButtonName>
      {unbindDisplay && (
        <SignerUnbindBox
          color={signerStyle.nameColor}
          onClick={(e) => {
            e.stopPropagation();
            dispatchModal({
              type: WlUserModalType.UNBIND_CONFIRM,
              payload: signerType,
            });
          }}
        >
          <IconUnlink size="1.2rem" />
        </SignerUnbindBox>
      )}
    </BindWithSignerButtonWrapper>
  );
};
export default BindWithSignerButton;

const BindWithSignerButtonWrapper = styled(ButtonBase)<{ bgColor: string }>`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background-color: ${({ bgColor }) => bgColor};
`;
const SignerButtonIconBox = styled.div`
  width: 24px;
  height: 24px;
`;
const SignerButtonName = styled.span<{ color: string }>`
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: ${({ color }) => color};
`;

const SignerUnbindBox = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  padding-left: 5px;
  border-left: 1px solid rgba(255, 255, 255, 0.4);
  color: ${({ color }) => color};
`;
