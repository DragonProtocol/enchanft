/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 14:23:42
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import ModalBase, {
  ModalBaseBody,
  ModalBaseTitle,
} from './common/modal/ModalBase';
import BindWithAuthorizerButton from './BindWithAuthorizerButton';
import IconClose from './common/icons/IconClose';
import { Authorizer } from '../authorizers';
import { useWlUserReact } from '../hooks';
import { createClassNamesByTheme } from '../utils/style';

export type BindModalProps = {
  isOpen: boolean;
  authorizer: Maybe<Authorizer>;
  onClose?: () => void;
};

const BindModal: React.FC<BindModalProps> = function ({
  isOpen,
  authorizer,
  onClose,
}: BindModalProps) {
  const { theme } = useWlUserReact();
  if (!authorizer) return null;
  const { name, type } = authorizer;
  return (
    <BindModalWrapper
      className={createClassNamesByTheme('wl-user-modal_bind', theme)}
      isOpen={isOpen}
    >
      <BindModalBody className="wl-user-modal_bind-body">
        <BindModalCloseButton className="btn-close" onClick={onClose}>
          <IconClose />
        </BindModalCloseButton>
        <ModalBaseTitle className="bind-title">Bind With</ModalBaseTitle>
        <BindModalDesc className="bind-desc">
          {name} is not connected. Please connect
          {name}.
        </BindModalDesc>
        <BindButton authorizerType={type} />
      </BindModalBody>
    </BindModalWrapper>
  );
};
export default BindModal;

const BindModalWrapper = styled(ModalBase)``;
const BindModalBody = styled(ModalBaseBody)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
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
