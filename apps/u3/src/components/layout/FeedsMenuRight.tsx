/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-11 14:27:42
 * @Description: file description
 */
import styled from 'styled-components';
import { ReactNode } from 'react';
import { ReactComponent as FilterFunnelSvg } from '../common/icons/svgs/filter-funnel.svg';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import {
  LayoutGrid,
  LayoutGridActive,
  LayoutList,
  LayoutListActive,
} from '../icons/layout';

export enum Layout {
  LIST,
  GRID,
}
type FeedsMenuRightProps = {
  orderByEl?: ReactNode;
  searchEl?: ReactNode;
  displayFilterButton?: boolean;
  isActiveFilter?: boolean;
  onChangeActiveFilter?: (active: boolean) => void;
  multiLayout?: boolean;
  layout?: Layout;
  setLayout?: (layout: Layout) => void;
};
export default function FeedsMenuRight({
  orderByEl,
  searchEl,
  displayFilterButton,
  isActiveFilter,
  onChangeActiveFilter,
  multiLayout,
  layout,
  setLayout,
}: FeedsMenuRightProps) {
  return (
    <FeedsMenuRightWrapper>
      {orderByEl && <OrderByBox>{orderByEl}</OrderByBox>}
      {displayFilterButton && (
        <FilterButton
          isActive={isActiveFilter}
          onClick={() =>
            onChangeActiveFilter && onChangeActiveFilter(!isActiveFilter)
          }
        >
          <FilterFunnelSvg />
        </FilterButton>
      )}

      {searchEl && <SearchBox>{searchEl}</SearchBox>}
      <MultiLayoutBox>
        {multiLayout && (
          <div className="layout">
            <span
              onClick={() => {
                if (setLayout) setLayout(Layout.LIST);
              }}
            >
              {(layout === Layout.LIST && <LayoutListActive />) || (
                <LayoutList />
              )}
            </span>
            <span
              onClick={() => {
                setLayout(Layout.GRID);
              }}
            >
              {(layout === Layout.GRID && <LayoutGridActive />) || (
                <LayoutGrid />
              )}
            </span>
          </div>
        )}
      </MultiLayoutBox>
    </FeedsMenuRightWrapper>
  );
}
const FeedsMenuRightWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
`;
const OrderByBox = styled.div``;
const FilterButton = styled(ButtonPrimaryLine)<{ isActive?: boolean }>`
  width: 52px;
  height: 40px;
  border-radius: 100px;
  padding: 0;
  ${({ isActive }) =>
    isActive &&
    `
    background: #718096;
    transition: all 0.3s ease-out;
    path {
      stroke: #14171A;
      transition: all 0.3s ease-out;
    }
  `}
`;
const SearchBox = styled.div`
  width: 200px;
`;
const MultiLayoutBox = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 10px;

  & .layout {
    display: flex;
    align-items: center;
    gap: 10px;
    > span {
      cursor: pointer;
    }
  }
`;
