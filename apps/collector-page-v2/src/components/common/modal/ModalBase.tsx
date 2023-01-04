/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:14:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-04 14:20:10
 * @Description: 基础按钮
 */
import React from 'react';
import styled, { css } from 'styled-components';
import ReactModal from 'react-modal';
import { isMobile } from 'react-device-detect';

export type ModalBaseProps = ReactModal.Props & {
  backdropFilter?: boolean;
};
const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  content: {
    position: 'absolute',
    width: 'fit-content',
    height: 'fit-content',
    padding: 0,
    margin: 0,
    top: '50%',
    left: '50%',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    transform: 'translate(-50%,-50%)',
    border: 'none',
    background: 'none',
  },
};
function ModalBase({
  children,
  backdropFilter,
  ...otherProps
}: ModalBaseProps) {
  const { overlay } = customStyles;
  if (backdropFilter) {
    Object.assign(overlay, {
      backdropFilter: 'blur(12px)',
    });
  }
  const styles = {
    overlay,
    content: customStyles.content,
  };
  return (
    <ReactModal style={styles as ReactModal.Styles} {...otherProps}>
      {children}
    </ReactModal>
  );
}
export default ModalBase;
export const ModalBaseBody = styled.div`
  padding: 20px;
  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;
`;
export const ModalBaseTitle = styled.p`
  margin: 0;
  padding: 0;
  font-style: italic;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;

  color: #ffffff;
  ${isMobile &&
  `
    font-size: 14px;
    line-height: 21px;
  `}
`;
