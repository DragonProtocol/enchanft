/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-10 11:46:47
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useRef } from 'react';

type FeedsFilterBoxProps = StyledComponentPropsWithRef<'div'> & {
  open?: boolean;
};
export default function FeedsFilterBox({
  children,
  open,
  ...otherProps
}: FeedsFilterBoxProps) {
  const bottomInnerRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (bottomInnerRef.current) {
      if (open) {
        bottomInnerRef.current.parentElement.style.height = `${bottomInnerRef.current.offsetHeight}px`;
        bottomInnerRef.current.parentElement.style.paddingTop = '20px';
        bottomInnerRef.current.parentElement.style.opacity = '1';
      } else {
        bottomInnerRef.current.parentElement.style.height = '0px';
        bottomInnerRef.current.parentElement.style.paddingTop = '0px';
        bottomInnerRef.current.parentElement.style.opacity = '0';
      }
    }
  }, [open]);
  return (
    <FeedsFilterBoxWrapper {...otherProps}>
      <FeedsFilterBoxInner
        ref={(el) => {
          if (el) {
            bottomInnerRef.current = el;
            bottomInnerRef.current.parentElement.style.height = `${el.offsetHeight}px`;
          }
        }}
      >
        {children}
      </FeedsFilterBoxInner>
    </FeedsFilterBoxWrapper>
  );
}
const FeedsFilterBoxWrapper = styled.div`
  padding-top: 20px;
  width: 100%;
  overflow: hidden;
  transition: all 0.3s ease-out;
`;
const FeedsFilterBoxInner = styled.div`
  width: 100%;
`;
