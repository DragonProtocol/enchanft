/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-05 17:39:03
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 11:04:02
 * @Description: file description
 */
import React from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';

export type ActionIconBoxProps = StyledComponentPropsWithRef<'div'> & {
  allowHandle?: boolean;
  isDone?: boolean;
};
const ActionIconBox: React.FC<ActionIconBoxProps> = ({
  children,
  allowHandle,
  isDone,
  ...otherProps
}: ActionIconBoxProps) => {
  return (
    <ActionIconBoxWrapper
      allowHandle={allowHandle}
      isDone={isDone}
      {...otherProps}
    >
      {children}
    </ActionIconBoxWrapper>
  );
};
export default ActionIconBox;
const ActionIconBoxWrapper = styled.div<{
  allowHandle?: boolean;
  isDone?: boolean;
}>`
  ${({ allowHandle, isDone }) => allowHandle && !isDone && `cursor: pointer;`}
`;
