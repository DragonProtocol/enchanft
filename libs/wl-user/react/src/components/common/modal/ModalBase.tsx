/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:14:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 14:39:33
 * @Description: 基础按钮
 */
import React from 'react';
import styled, { css, StyledComponentPropsWithRef } from 'styled-components';
import ReactModal from 'react-modal';
import { isMobile } from 'react-device-detect';

const ModalBaseTitleEl = styled.p`
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
export function ModalBaseTitle({
  children,
  className,
  ...otherProps
}: StyledComponentPropsWithRef<'p'>) {
  return (
    <ModalBaseTitleEl
      className={`wl-user-modal-base-title ${className}`}
      {...otherProps}
    >
      {children}
    </ModalBaseTitleEl>
  );
}
const ModalBaseBodyEl = styled.div`
  width: 540px;
  padding: 20px;
  box-sizing: border-box;
  background: #f7f9f1;
  border-radius: 20px;
  ${isMobile &&
  `
  width: auto;
  `}
`;
export function ModalBaseBody({
  children,
  className,
  ...otherProps
}: StyledComponentPropsWithRef<'div'>) {
  return (
    <ModalBaseBodyEl
      className={`wl-user-modal-base-body ${className}`}
      {...otherProps}
    >
      {children}
    </ModalBaseBodyEl>
  );
}
export type ModalBaseProps = ReactModal.Props & {
  backdropFilter?: boolean;
  zIndex?: number;
};
const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    position: 'absolute',
    width: 'auto',
    height: 'auto',
    padding: 0,
    margin: 0,
    top: '40%',
    left: '50%',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    transform: 'translate(-50%,-50%)',
  },
};
function ModalBase({
  children,
  backdropFilter,
  zIndex = 9999,
  className,
  ...otherProps
}: ModalBaseProps) {
  const { overlay } = customStyles;
  if (backdropFilter) {
    Object.assign(overlay, {
      backdropFilter: 'blur(12px)',
      zIndex,
    });
  }
  const styles = {
    overlay,
    content: customStyles.content,
  };
  return (
    <ReactModal
      className={`wl-user-modal ${className}`}
      style={styles as ReactModal.Styles}
      {...otherProps}
    >
      {children}
    </ReactModal>
  );
}
export default ModalBase;
