/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-29 10:38:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 11:31:05
 * @Description: file description
 */
import React from 'react';
import styled, {
  css,
  FlattenSimpleInterpolation,
  StyledComponentPropsWithRef,
} from 'styled-components';

export enum CardItemBoxAnimationType {
  HOVER_MOVE_UP = 'HOVER_MOVE_UP',
}
const hoverMoveUpCss = css`
  /* 鼠标移入整体上移2px */
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 0px rgba(0, 0, 0, 0.25);
  }
  transition: all 0.3s ease-out;
`;
export const CardItemBoxAnimationMap = {
  [CardItemBoxAnimationType.HOVER_MOVE_UP]: hoverMoveUpCss,
};
export type CardItemBoxProps = StyledComponentPropsWithRef<'div'> & {
  animationType?: CardItemBoxAnimationType;
};
const CardItemBox: React.FC<CardItemBoxProps> = ({
  children,
  animationType,
  ...otherProps
}: CardItemBoxProps) => {
  const props = otherProps;
  if (animationType) {
    const animationCss = CardItemBoxAnimationMap[animationType];
    Object.assign(props, { animationCss });
  }

  return <CardItemBoxWrapper {...props}>{children}</CardItemBoxWrapper>;
};
export default CardItemBox;

const CardItemBoxWrapper = styled.div<{
  animationCss?: FlattenSimpleInterpolation;
}>`
  width: 100%;
  background: #f7f9f1;
  outline: 2px solid #333333;
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;
  ${({ animationCss }) => animationCss}
`;
