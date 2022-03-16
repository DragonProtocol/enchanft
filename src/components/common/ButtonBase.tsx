import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { CursorPointerUpCss, FontFamilyCss } from '../../GlobalStyle'
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{}

const ButtonBase: React.FC<ButtonProps> = ({ children, ...otherProps }:ButtonProps) => {
  return <ButtonBaseWrapper {...otherProps}>{children}</ButtonBaseWrapper>
}
export default ButtonBase
export const ButtonPrimary = styled(ButtonBase)`
  background-color: #3dd606;
`
export const ButtonWarning = styled(ButtonBase)`
  background-color: #ebb700;
`
export const ButtonDanger = styled(ButtonBase)`
  background-color: #D60606;
`
export const ButtonBaseCss = css`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  font-size: 12px;
  color: #ffffff;
  border: none;
  ${FontFamilyCss}
  ${CursorPointerUpCss}
`
const ButtonBaseWrapper = styled.button`
  ${ButtonBaseCss}
`
