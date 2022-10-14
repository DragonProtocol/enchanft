/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:14:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 18:17:24
 * @Description: 基础按钮
 */
import React from 'react';
import styled, { css } from 'styled-components';
import Modal from 'react-modal';
export type ModalBaseProps = ReactModal.Props;

const ModalBase: React.FC<ModalBaseProps> = ({
  children,
  ...otherProps
}: ModalBaseProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ModalBaseWrapper
    className="wl-user-modal_box"
    overlayClassName="wl-user-modal_body"
    {...otherProps}
  >
    {children}
  </ModalBaseWrapper>
);
export default ModalBase;

const ModalBaseWrapper = styled(Modal)`
  .wl-user-modal_box {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;
