/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-15 16:50:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-15 14:29:41
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import { MEDIA_BREAK_POINTS } from '../../../constants';
import Loading from '../../common/loading/Loading';
import CommunityItem, { CommunityItemDataViewType } from './CommunityItem';

export type CommunityListViewConfigType = {
  loading?: boolean;
  loadingMsg?: string;
  emptyMsg?: string;
};
export type CommunityListItemsType = CommunityItemDataViewType[];
export type CommunityListProps = CommunityListViewConfigType & {
  items: CommunityListItemsType;
};
const CommunityList: React.FC<CommunityListProps> = ({
  items,
  loading,
  loadingMsg = 'loading...',
  emptyMsg = 'no communitys',
}: CommunityListProps) => (
  <>
    {loading && (
      <CommunityListLoading>
        <Loading />
      </CommunityListLoading>
    )}
    {!loading && items.length === 0 && emptyMsg && (
      <CommunityListEmpty>{emptyMsg}</CommunityListEmpty>
    )}
    <CommunityListWrapper>
      {!loading &&
        items.length > 0 &&
        items.map((item) => (
          <CommunityItem
            key={`${item.data.id}`}
            data={item.data}
            viewConfig={item.viewConfig}
          />
        ))}
    </CommunityListWrapper>
  </>
);
export default CommunityList;
const CommunityListWrapper = styled.div`
  width: 100%;
  min-height: 100px;
  display: grid;
  grid-gap: 20px;
  justify-content: space-between;
  list-style-type: none;
  grid-template-columns: repeat(4, minmax(250px, 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    grid-template-columns: repeat(3, minmax(250px, 1fr));
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.sm}px) and (max-width: ${MEDIA_BREAK_POINTS.md}px) {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
  }
  @media (max-width: ${MEDIA_BREAK_POINTS.sm}px) {
    display: flex;
    flex-direction: column;
    grid-gap: 20px;
  }
`;
const CommunityListLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CommunityListEmpty = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
