/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-10 13:01:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-12 17:01:28
 * @Description: file description
 */
import React from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import MainInner from './MainInner';
const MainInnerStatusBox: React.FC<StyledComponentPropsWithRef<'div'>> = ({
  children,
  ...divProps
}) => {
  return (
    <MainInnerStatusBoxWrapper {...divProps}>
      {children}
    </MainInnerStatusBoxWrapper>
  );
};
export default MainInnerStatusBox;
const MainInnerStatusBoxWrapper = styled(MainInner)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
`;
