/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:14:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-19 17:31:43
 * @Description: 基础按钮
 */
import styled, { css, StyledComponentPropsWithRef } from 'styled-components';

export type ButtonProps = StyledComponentPropsWithRef<'button'>;

function ButtonBase({ children, ...otherProps }: ButtonProps) {
  return <ButtonBaseWrapper {...otherProps}>{children}</ButtonBaseWrapper>;
}
export default ButtonBase;

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
  border: none;
`;
const ButtonBaseWrapper = styled.button`
  ${ButtonBaseCss}
  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
  }
`;

export const ButtonPrimary = styled(ButtonBaseWrapper)`
  background-color: #ffffff;
  color: #14171a;
`;
export const ButtonPrimaryLine = styled(ButtonBaseWrapper)`
  border: 1px solid #39424c;
  background-color: #1a1e23;
  color: #718096;
  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
    border: none;
    background-color: #14171a;
  }
  &:not(:disabled):hover {
    border: 1px solid #aaa;
    background-color: #14171a;
  }
`;
export const ButtonWarning = styled(ButtonBaseWrapper)`
  background-color: #ebb700;
`;
export const ButtonDanger = styled(ButtonBaseWrapper)`
  background-color: #d60606;
`;
export const ButtonInfo = styled(ButtonBaseWrapper)`
  background-color: #ebeee4;
  color: #333333;
`;
