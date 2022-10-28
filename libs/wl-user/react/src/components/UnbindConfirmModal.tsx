/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-23 17:24:16
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import ModalBase, { ModalBaseTitle } from './common/modal/ModalBase';
import { isMobile } from 'react-device-detect';
import { SignerType } from '@ecnft/wl-user-core';
import { ButtonInfo, ButtonDanger } from './common/button/ButtonBase';
export type UnbindConfirmModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  signerType: SignerType;
  onConfirm?: (signerType: SignerType) => void;
  onClose?: () => void;
};
const UnbindConfirmModal: React.FC<UnbindConfirmModalProps> = ({
  isOpen,
  isLoading,
  signerType,
  onConfirm,
  onClose,
}: UnbindConfirmModalProps) => {
  return (
    <UnbindConfirmModalWrapper isOpen={isOpen}>
      <UnbindConfirmModalBody className="wl-user-modal-unbind-confirm_body">
        <ModalBaseTitle>Disconnect</ModalBaseTitle>
        <UnbindConfirmModalDesc className="wl-user-modal-unbind-confirm_title">
          This {signerType} account cannot be connected within 24h after
          disconnection.
        </UnbindConfirmModalDesc>
        <UnbindConfirmModalBtns className="wl-user-modal-unbind-confirm_btns">
          <CloseBtn onClick={onClose}>Cancel</CloseBtn>
          <ConfirmBtn
            disabled={isLoading}
            onClick={() => onConfirm && onConfirm(signerType)}
          >
            {isLoading ? 'Loading ...' : 'Still to Disconnect'}
          </ConfirmBtn>
        </UnbindConfirmModalBtns>
      </UnbindConfirmModalBody>
    </UnbindConfirmModalWrapper>
  );
};
export default UnbindConfirmModal;

const UnbindConfirmModalWrapper = styled(ModalBase)``;
const UnbindConfirmModalBody = styled.div`
  width: 540px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f7f9f1;
  border-radius: 20px;
`;
const UnbindConfirmModalDesc = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
`;
const UnbindConfirmModalBtns = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 24px;
`;
const CloseBtn = styled(ButtonInfo)`
  width: 120px;
`;
const ConfirmBtn = styled(ButtonDanger)`
  width: 204px;
`;