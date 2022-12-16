/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-16 18:03:40
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import ModalBase, { ModalBaseTitle } from './common/modal/ModalBase';
import { ButtonInfo, ButtonDanger } from './common/button/ButtonBase';
import { Authorizer, AuthorizerType } from '../authorizers';
import { useWlUserReact } from '../hooks';
import { createClassNamesByTheme } from '../utils/style';

export type UnbindConfirmModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  authorizer: Authorizer;
  onConfirm?: (authorizerType: AuthorizerType) => void;
  onClose?: () => void;
};
function UnbindConfirmModal({
  isOpen,
  isLoading,
  authorizer,
  onConfirm,
  onClose,
}: UnbindConfirmModalProps) {
  const { theme } = useWlUserReact();
  if (!authorizer) return null;
  return (
    <UnbindConfirmModalWrapper
      isOpen={isOpen}
      className={createClassNamesByTheme('wl-user-modal_unbind-confirm', theme)}
    >
      <UnbindConfirmModalBody className="wl-user-modal_unbind-confirm-title">
        <ModalBaseTitle className="wl-user-modal_unbind-confirm-title">
          Disconnect
        </ModalBaseTitle>
        <UnbindConfirmModalDesc className="wl-user-modal_unbind-confirm-desc">
          This {authorizer.name} account cannot be connected within 24h after
          disconnection.
        </UnbindConfirmModalDesc>
        <UnbindConfirmModalBtns className="wl-user-modal_unbind-confirm-btns">
          <CloseBtn
            onClick={onClose}
            className="wl-user-modal_unbind-confirm-cancel"
          >
            Cancel
          </CloseBtn>
          <ConfirmBtn
            disabled={isLoading}
            onClick={() => onConfirm && onConfirm(authorizer.type)}
            className="wl-user-modal_unbind-confirm-submit"
          >
            {isLoading ? 'Loading ...' : 'Disconnect'}
          </ConfirmBtn>
        </UnbindConfirmModalBtns>
      </UnbindConfirmModalBody>
    </UnbindConfirmModalWrapper>
  );
}
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
  width: 120px;
`;
