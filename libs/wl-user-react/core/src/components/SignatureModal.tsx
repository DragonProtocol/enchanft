/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-20 10:58:37
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import ModalBase, { ModalBaseTitle } from './common/modal/ModalBase';
import { isMobile } from 'react-device-detect';
import { SignerProcessStatus } from '../signer/types';
import { ButtonPrimary, ButtonInfo } from './common/button/ButtonBase';
export type SignatureModalProps = {
  isOpen: boolean;
  signerProcessStatus: SignerProcessStatus;
  onRetry?: () => void;
  onClose?: () => void;
};
const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  signerProcessStatus,
  onRetry,
  onClose,
}: SignatureModalProps) => {
  let title = '';
  let desc = '';
  let closeBtnDisplay = false;
  let retryBtnDisplay = false;
  switch (signerProcessStatus) {
    case SignerProcessStatus.SIGNATURE_PENDING:
      title = '🕹 Signature Request';
      desc =
        'Please sign the message in your wallet to bind WL, we use this signature to verify that you‘re theowner.';
      break;
    case SignerProcessStatus.SIGNATURE_REJECTED:
      title = '❌ Signature Rejected';
      desc = 'Please sign the message in your wallet to bind.';
      closeBtnDisplay = true;
      retryBtnDisplay = true;
      break;
    case SignerProcessStatus.LOGIN_PENDING:
      title = '⏳ Loading';
      desc = 'Logging in now, Please wait...';
      break;
    case SignerProcessStatus.LOGIN_REJECTED:
      title = '❌ Login Fail';
      desc = '';
      closeBtnDisplay = true;
      retryBtnDisplay = true;
      break;
    case SignerProcessStatus.BIND_PENDING:
      title = '⏳ Loading';
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
