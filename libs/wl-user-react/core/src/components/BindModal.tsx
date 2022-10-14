/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-14 19:07:15
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import ModalBase from './common/modal/ModalBase';
import { isMobile } from 'react-device-detect';
import BindSignerButton from './BindSignerButton';
import { SignerType } from '../signer';
export type BindModalProps = {
  isOpen: boolean;
  signerType: SignerType;
  onBindEnd?: () => void;
};

const BindModal: React.FC<BindModalProps> = ({
  isOpen,
  signerType,
  onBindEnd,
}: BindModalProps) => {
  return (
    <BindModalWrapper isOpen={isOpen}>
      <BindModalBody className="wl-user-modal_login-body">
        <BindModalTitle isMobile={isMobile}>Bind With</BindModalTitle>
        <BindSignerButton signerType={signerType} onBindEnd={onBindEnd} />
      </BindModalBody>
    </BindModalWrapper>
  );
};
export default BindModal;

const BindModalWrapper = styled(ModalBase)`
  width: 200px;
  height: 48px;
`;
const BindModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;

  position: relative;
  width: 384px;
  height: 250px;

  background: #f7f9f1;
  border-radius: 20px;
`;
const BindModalTitle = styled.p<{ isMobile: boolean }>`
  margin: 0;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
  ${({ isMobile }) =>
    isMobile &&
    `
    font-size: 14px;
    line-height: 21px;
  `}
`;
