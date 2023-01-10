/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-09 17:11:06
 * @Description: file description
 */
import styled from 'styled-components';
import { ReactNode } from 'react';
import { ReactComponent as FilterFunnelSvg } from '../common/icons/svgs/filter-funnel.svg';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';

type FeedsMenuRightProps = {
  orderByEl?: ReactNode;
  searchEl?: ReactNode;
  isActiveFilter?: boolean;
  onChangeActiveFilter?: (active: boolean) => void;
};
export default function FeedsMenuRight({
  orderByEl,
  searchEl,
  isActiveFilter,
  onChangeActiveFilter,
}: FeedsMenuRightProps) {
  return (
    <FeedsMenuRightWrapper>
      {orderByEl && <OrderByBox>{orderByEl}</OrderByBox>}
      <FilterButton
        isActive={isActiveFilter}
        onClick={() =>
          onChangeActiveFilter && onChangeActiveFilter(!isActiveFilter)
        }
      >
        <FilterFunnelSvg />
      </FilterButton>
      {searchEl && <SearchBox>{searchEl}</SearchBox>}
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
