/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-26 16:19:54
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import ModalBase, { ModalBaseTitle } from './common/modal/ModalBase';
import { isMobile } from 'react-device-detect';
import { SignerProcessStatus, SignerType } from '@ecnft/wl-user-core';
import { ButtonPrimary, ButtonInfo } from './common/button/ButtonBase';
import { WlUserActionType } from '../provider';
import { isWeb2Signer, isWeb3Signer } from '../utils';
import { SignerStyleMap } from './signerStyle';
export type SignatureModalProps = {
  isOpen: boolean;
  signerType: SignerType;
  signerActionType: WlUserActionType;
  signerProcessStatus: SignerProcessStatus;
  onRetry?: () => void;
  onClose?: () => void;
};

const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  signerType,
  signerActionType,
  signerProcessStatus,
  onRetry,
  onClose,
}: SignatureModalProps) => {
  const SignerActionNames = {
    [WlUserActionType.LOGIN]: 'login',
    [WlUserActionType.BIND]: 'bind',
  };
  let title = '';
  let desc = '';
  let actionName = SignerActionNames[signerActionType];
  let closeBtnDisplay = false;
  let retryBtnDisplay = false;
  const signerName = SignerStyleMap[signerType]?.name;
  switch (signerProcessStatus) {
    case SignerProcessStatus.SIGNATURE_PENDING:
      if (isWeb3Signer(signerType)) {
        title = '🕹 Signature Request';
        desc = `Please sign the message in your wallet to ${actionName} WL, we use this signature to verify that you‘re theowner.`;
      } else if (isWeb2Signer(signerType)) {
        title = '🕹 Authorize Request';
        desc = ` Please authorize your ${signerName} account.`;
      }
      break;
    case SignerProcessStatus.SIGNATURE_REJECTED:
      if (isWeb3Signer(signerType)) {
        title = '❌ Signature Rejected';
        desc = `Please sign the message in your wallet to ${actionName}.`;
      } else if (isWeb2Signer(signerType)) {
        title = '❌ Authorize Rejected';
        desc = ` Please authorize your ${signerName} account.`;
      }
      closeBtnDisplay = true;
      retryBtnDisplay = true;
      break;
    case SignerProcessStatus.LOGIN_PENDING:
      title = '⏳ Logging';
      desc = 'Logging in now, Please wait...';
      break;
    case SignerProcessStatus.LOGIN_REJECTED:
      title = '❌ Login Fail';
      desc = '';
      closeBtnDisplay = true;
      retryBtnDisplay = true;
      break;
    case SignerProcessStatus.BIND_PENDING:
      title = '⏳ Binding';
      desc = 'Binding in now, Please wait...';
      break;
    case SignerProcessStatus.BIND_REJECTED:
      title = '❌  Bind Fail';
      desc = '';
      closeBtnDisplay = true;
      retryBtnDisplay = true;
      break;
  }
  return (
    <SignatureModalWrapper backdropFilter={true} isOpen={isOpen}>
      <SignatureModalBody className="wl-user-modal-signature_body">
        <ModalBaseTitle>{title}</ModalBaseTitle>
        <SignatureModalDesc className="wl-user-modal-signature_title">
          {desc}
        </SignatureModalDesc>
        <SignatureModalBtns className="wl-user-modal-signature_btns">
          {closeBtnDisplay && <CloseBtn onClick={onClose}>Cancel</CloseBtn>}
          {retryBtnDisplay && <RetryBtn onClick={onRetry}>Retry</RetryBtn>}
        </SignatureModalBtns>
      </SignatureModalBody>
    </SignatureModalWrapper>
  );
};
export default SignatureModal;

const SignatureModalWrapper = styled(ModalBase)``;
const SignatureModalBody = styled.div`
  width: 540px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f7f9f1;
  border-radius: 20px;
`;
const SignatureModalDesc = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
`;
const SignatureModalBtns = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 24px;
`;
const CloseBtn = styled(ButtonInfo)`
  width: 120px;
  height: 48px;
`;
const RetryBtn = styled(ButtonPrimary)`
  width: 120px;
  height: 48px;
`;
