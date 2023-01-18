/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 17:47:21
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-17 20:27:33
 * @Description: file description
 */
import React, { useCallback } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useInView } from 'react-intersection-observer';

export type ListScrollBoxProps = StyledComponentPropsWithRef<'div'> & {
  // 盒子滚动到底部
  onScrollBottom?: () => void;
};
function ListScrollBox({
  children,
  onScrollBottom,
  ...divProps
}: ListScrollBoxProps) {
  const { ref: inviewRef, inView } = useInView({
    threshold: 0,
  });
  const handleScroll = useCallback(() => {
    if (inView && onScrollBottom) {
      onScrollBottom();
    }
  }, [inView, onScrollBottom]);
  return (
    <ListScrollBoxWrapper {...divProps} onScroll={handleScroll}>
      {children}
      {/* 当前滚动盒子的锚点 */}
      <div style={{ height: '30px' }} ref={inviewRef} />
    </ListScrollBoxWrapper>
  );
}
export default ListScrollBox;
const ListScrollBoxWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: overlay;
  box-sizing: border-box;
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 2px;
  }
  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: rgba(0, 0, 0, 0.3);
    box-shadow: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(17, 16, 16, 0.13);
    -webkit-box-shadow: rgba(0, 0, 0, 0.9);
    box-shadow: rgba(0, 0, 0, 0.5);
  }
  ::-webkit-scrollbar-thumb:window-inactive {
    background: #1b1e23;
  }
`;
