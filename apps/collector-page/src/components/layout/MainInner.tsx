/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-10 13:01:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-24 00:04:17
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { MEDIA_BREAK_POINTS } from '../../constants/index';
const MainInner: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...divProps
}) => {
  return <MainInnerWrapper {...divProps}>{children}</MainInnerWrapper>;
};
export default MainInner;
const MainInnerWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 72px - 40px - 72px);
  box-sizing: border-box;
  padding: 0 40px;
  margin: 20px 0;
  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    width: ${MEDIA_BREAK_POINTS.xxl}px;
    margin: 20px auto;
  }
  @media (max-width: ${MEDIA_BREAK_POINTS.sm}px) {
    padding: 0 20px;
  }
`;
