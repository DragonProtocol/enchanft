/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 18:27:08
 * @Description: file description
 */
import React from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import ButtonBase from './ButtonBase';

export type ButtonProps = StyledComponentPropsWithRef<any>;

const ButtonNavigation: React.FC<ButtonProps> = ({
  children,
  ...otherProps
}: ButtonProps) => (
  <ButtonNavigationWrapper {...otherProps}>{children}</ButtonNavigationWrapper>
);
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
