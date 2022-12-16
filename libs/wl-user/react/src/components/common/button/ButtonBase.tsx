/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:14:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-16 14:42:18
 * @Description: 基础按钮
 */
import styled, { css, StyledComponentPropsWithRef } from 'styled-components';

export type ButtonProps = StyledComponentPropsWithRef<'button'>;

function ButtonBase({ children, ...otherProps }: ButtonProps) {
  return <ButtonBaseWrapper {...otherProps}>{children}</ButtonBaseWrapper>;
}
export default ButtonBase;
export const ButtonPrimary = styled(ButtonBase)`
  background-color: #3dd606;
  color: #ffffff;
`;
export const ButtonWarning = styled(ButtonBase)`
  background-color: #ebb700;
  color: #ffffff;
`;
export const ButtonDanger = styled(ButtonBase)`
  background-color: #d60606;
  color: #ffffff;
`;
export const ButtonInfo = styled(ButtonBase)`
  background-color: #ebeee4;
  color: #333333;
`;

export const ButtonBaseCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  height: 48px;
  padding: 16px 18px;
  box-sizing: border-box;
  border-radius: 10px;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  font-family: inherit;
`;
const ButtonBaseWrapper = styled.button`
  ${ButtonBaseCss}
  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
  }
`;
