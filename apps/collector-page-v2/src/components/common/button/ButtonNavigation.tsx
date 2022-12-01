/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 18:36:37
 * @Description: file description
 */
import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import ButtonBase from './ButtonBase';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function ButtonNavigation({ children, ...otherProps }: ButtonProps) {
  return (
    <ButtonNavigationWrapper {...otherProps}>
      {children}
    </ButtonNavigationWrapper>
  );
}
export default ButtonNavigation;

const ButtonNavigationWrapper = styled(ButtonBase)`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  background: #e4ffdb;
  border: 2px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
`;
