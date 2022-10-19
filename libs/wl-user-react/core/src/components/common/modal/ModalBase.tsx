/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:14:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-19 14:47:31
 * @Description: 基础按钮
 */
import React from 'react';
import styled, { css } from 'styled-components';
import ReactModal from 'react-modal';
import { isMobile } from 'react-device-detect';
export type ModalBaseProps = ReactModal.Props;
const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  content: {
    position: 'absolute',
    width: 'auto',
    height: 'auto',
    padding: 0,
    margin: 0,
    top: '40px',
    left: '50%',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    transform: 'translateX(-50%)',
  },
};
const ModalBase: React.FC<ModalBaseProps> = ({
  children,
  ...otherProps
}: ModalBaseProps) => (
  <ReactModal style={customStyles} {...otherProps}>
    {children}
  </ReactModal>
);
export default ModalBase;
export const ModalBaseTitle = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  color: #333333;
  ${isMobile &&
  `
    font-size: 14px;
    line-height: 21px;
  `}
`;
