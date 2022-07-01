/*
 * @Author: your name
 * @Date: 2022-03-15 11:15:41
 * @LastEditTime: 2022-04-02 11:04:02
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \synft-app\src\components\common\ButtonBase.tsx
 */
import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { CursorPointerUpCss, DisabledMaskCss, FontFamilyCss } from '../../GlobalStyle'
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ButtonBase: React.FC<ButtonProps> = ({ children, ...otherProps }: ButtonProps) => {
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
  ${FontFamilyCss}
  ${CursorPointerUpCss}
`
const ButtonBaseWrapper = styled.button`
  ${ButtonBaseCss}
  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
  }
`
