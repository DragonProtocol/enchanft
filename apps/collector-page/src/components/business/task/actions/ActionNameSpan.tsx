/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-05 17:16:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-05 18:24:50
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
export type ActionNameSpanProps = HTMLAttributes<HTMLSpanElement> & {
  allowHandle?: boolean;
  isDone?: boolean;
};

const ActionNameSpan: React.FC<ActionNameSpanProps> = ({
  children,
  allowHandle,
  isDone,
  ...otherProps
}: ActionNameSpanProps) => {
  let ActionNameCss: FlattenSimpleInterpolation = css``;
  if (allowHandle) {
    if (isDone) {
      ActionNameCss = ActionNameDoneCss;
    } else {
      ActionNameCss = ActionNameTodoCss;
    }
  }

  return (
    <ActionNameSpanWrapper spanCss={ActionNameCss} {...otherProps}>
      {children}
    </ActionNameSpanWrapper>
  );
};
export default ActionNameSpan;
const ActionNameTodoCss = css`
  cursor: pointer;
  /* 鼠标浮上加下划线 */
  &:hover {
    text-decoration-line: underline;
  }
  /* 鼠标点下整体变绿色 */
  &:active {
    color: #3dd606;
  }
`;
const ActionNameDoneCss = css`
  text-decoration-line: line-through;
  color: #333333;
  opacity: 0.5;
`;
const ActionNameSpanWrapper = styled.span<{
  spanCss: FlattenSimpleInterpolation;
}>`
  ${({ spanCss }) => spanCss}
`;
