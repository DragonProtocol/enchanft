/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:14:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-01 15:29:36
 * @Description: 基础按钮
 */
import React, { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ButtonBase: React.FC<ButtonProps> = ({ children, ...otherProps }: ButtonProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ButtonBaseWrapper {...otherProps}>{children}</ButtonBaseWrapper>
)
export default ButtonBase
export const ButtonPrimary = styled(ButtonBase)`
  background-color: #3dd606;
`
export const ButtonWarning = styled(ButtonBase)`
  background-color: #ebb700;
`
export const ButtonDanger = styled(ButtonBase)`
  background-color: #d60606;
`

export const ButtonBaseCss = css`
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  font-size: 12px;
  color: #ffffff;
  border: none;
  cursor: pointer;
`
const ButtonBaseWrapper = styled.button`
  ${ButtonBaseCss}
  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
  }
`
export const ButtonInfo = styled(ButtonBaseWrapper)`
  background: #ffffff;
  border: 4px solid #222222;
  color: #222222;
  box-shadow: none;
`
