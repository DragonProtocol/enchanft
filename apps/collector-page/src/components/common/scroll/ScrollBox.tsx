/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-29 11:14:14
 * @Description: 滚动盒子，提供视口滚动监听
 */
import React, { HTMLAttributes, useEffect } from 'react'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'
import { ScrollBarCss } from '../../../GlobalStyle'
type ScrollBarSize = 'sm' | 'md'
type ScrollBoxProps = HTMLAttributes<HTMLDivElement> & {
  // 当前滚动盒子的ID
  boxId?: string
  // 当前滚动盒子的父级盒子元素
  rootEl?: HTMLElement | null
  // 当前滚动盒子的锚点进入视口时触发
  onInView?: () => void
  // scroll bar css
  barSize?: ScrollBarSize
}
const ScrollBox: React.FC<ScrollBoxProps> = ({
  children,
  rootEl,
  onInView,
  boxId,
  barSize = 'md',
  ...divProps
}: ScrollBoxProps) => {
  const { ref: inViewRef, inView } = useInView({
    root: rootEl || null,
    threshold: 0,
  })
  useEffect(() => {
    if (inView && onInView) onInView()
  }, [inView, onInView])
  return (
    <ScrollBoxWrapper id={boxId} barSize={barSize} {...divProps}>
      {children}
      {/* 当前滚动盒子的锚点 */}
      <div ref={inViewRef} />
    </ScrollBoxWrapper>
  )
}
export default ScrollBox
const ScrollBoxWrapper = styled.div<{ barSize?: ScrollBarSize }>`
  width: 100%;
  height: 100%;
  overflow-y: overlay;
  ${({ barSize }) => barSize && barSize === 'sm' && ScrollBarCss}
`
