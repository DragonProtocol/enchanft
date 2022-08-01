/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-27 18:57:08
 * @Description: file description
 */
import React, { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'
import ButtonBase from './ButtonBase'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const ButtonNavigation: React.FC<ButtonProps> = ({ children, ...otherProps }: ButtonProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ButtonNavigationWrapper {...otherProps}>{children}</ButtonNavigationWrapper>
)
export default ButtonNavigation

const ButtonNavigationWrapper = styled(ButtonBase)`
  width: 50px;
  height: 50px;
  background: #e4ffdb;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
`
