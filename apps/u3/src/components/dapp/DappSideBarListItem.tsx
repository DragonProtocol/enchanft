/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-16 16:42:41
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import React from 'react';
import { ProjectExploreListItemResponse } from '../../services/types/project';
import ProjectImgDefault from '../project/ProjectImgDefault';
import { ReactComponent as DappHandleIcon } from '../common/icons/svgs/dots-vertical.svg';

export type DappSideBarListItemData = ProjectExploreListItemResponse;
export type DappSideBarListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: DappSideBarListItemData;
  onOpen?: () => void;
  onOpenHandles?: () => void;
  disabled?: boolean;
};
export default React.forwardRef(function DappSideBarListItem(
  { data, onOpen, onOpenHandles, disabled, ...props }: DappSideBarListItemProps,
  ref
) {
  return (
    <ExploreListItemWrapper
      {...props}
      disabled={disabled}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <ListItemInner>
        <ItemImg
          draggable={false}
          src={data.image}
          onClick={() => !disabled && onOpen && onOpen()}
          title={data.name}
        />
        <HandleIconBox
          draggable={false}
          className="handle-icon-box"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled && onOpenHandles) onOpenHandles();
          }}
        >
          <DappHandleIcon />
        </HandleIconBox>
      </ListItemInner>
    </ExploreListItemWrapper>
  );
});
const ExploreListItemWrapper = styled.div<{ disabled?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  ${({ disabled }) =>
    disabled &&
    `
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
  `}
`;
const ListItemInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #14171a;
  border-radius: 10px;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.2);
  }
`;

const ItemImg = styled(ProjectImgDefault)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
  cursor: pointer;
`;
const HandleIconBox = styled.span`
  width: 100%;
  height: 16px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;
