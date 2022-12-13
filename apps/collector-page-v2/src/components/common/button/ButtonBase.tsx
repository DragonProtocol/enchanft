/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:14:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-13 12:24:13
 * @Description: 基础按钮
 */
import styled, { css, StyledComponentPropsWithRef } from 'styled-components';

export type ButtonProps = StyledComponentPropsWithRef<'button'>;

function ButtonBase({ children, ...otherProps }: ButtonProps) {
  return <ButtonBaseWrapper {...otherProps}>{children}</ButtonBaseWrapper>;
}
export default ButtonBase;
export const ButtonPrimary = styled(ButtonBase)`
  background-color: #ffffff;
  color: #14171a;
`;
export const ButtonPrimaryLine = styled(ButtonBase)`
  border: 1px solid #39424c;
  background-color: #1a1e23;
  color: #718096;
`;
export const ButtonWarning = styled(ButtonBase)`
  background-color: #ebb700;
`;
export const ButtonDanger = styled(ButtonBase)`
  background-color: #d60606;
`;
export const ButtonInfo = styled(ButtonBase)`
  background-color: #ebeee4;
  color: #333333;
`;

export const ButtonBaseCss = css`
  height: 48px;
  padding: 12px 24px;
  box-sizing: border-box;
  border-radius: 12px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;
const ButtonBaseWrapper = styled.button`
  ${ButtonBaseCss}
  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
  }
`;
