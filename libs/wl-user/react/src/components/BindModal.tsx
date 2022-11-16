/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-10 19:09:02
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import ModalBase, { ModalBaseTitle } from './common/modal/ModalBase';
import { isMobile } from 'react-device-detect';
import BindWithAuthorizerButton from './BindWithAuthorizerButton';
import IconClose from './common/icons/IconClose';
import { Authorizer } from '../authorizers';
export type BindModalProps = {
  isOpen: boolean;
  authorizer: Authorizer | null;
  onClose?: () => void;
};

const BindModal: React.FC<BindModalProps> = ({
  isOpen,
  authorizer,
  onClose,
}: BindModalProps) => {
  if (!authorizer) return null;
  const { name, type } = authorizer;
  return (
    <BindModalWrapper isOpen={isOpen}>
      <BindModalBody className="wl-user-modal_login-body">
        <BindModalCloseButton onClick={onClose}>
          <IconClose />
        </BindModalCloseButton>
        <ModalBaseTitle>Bind With</ModalBaseTitle>
        <BindModalDesc>
          {name} is not connected. Please connect {name}.
        </BindModalDesc>
        <BindButton authorizerType={type} />
      </BindModalBody>
    </BindModalWrapper>
  );
};
export default BindModal;

const BindModalWrapper = styled(ModalBase)``;
const BindModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  position: relative;
  background: #f7f9f1;
  border-radius: 20px;
`;
const BindModalCloseButton = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin: 20px;
  cursor: pointer;
`;
const BindModalDesc = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
`;
const BindButton = styled(BindWithAuthorizerButton)`
  width: 100%;
  height: 60px;
`;
