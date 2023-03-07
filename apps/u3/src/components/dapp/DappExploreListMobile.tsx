/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 12:15:13
 * @Description: file description
 */
import { useCallback } from 'react';
import styled from 'styled-components';
import {
  DappExploreListItemData,
  DappExploreListItemMobile,
} from './DappExploreListItem';

export type DappExploreListProps = {
  data: DappExploreListItemData[];
  installPendingIds?: Array<string | number>;
  onInstall?: (item: DappExploreListItemData) => void;
  onOpen?: (item: DappExploreListItemData) => void;
  onItemClick?: (item: DappExploreListItemData) => void;
};
export default function DappExploreListMobile({
  data,
  installPendingIds = [],
  onInstall,
  onOpen,
  onItemClick,
}: DappExploreListProps) {
  const loadingInstall = useCallback(
    (id: string | number) => installPendingIds.includes(id),
    [installPendingIds]
  );
  return (
    <DappExploreListWrapper>
      {data.map((item) => {
        return (
          <DappExploreListItemMobile
            key={item.id}
            data={item}
            onClick={() => onItemClick && onItemClick(item)}
            displayButtons={false}
          />
        );
      })}
    </DappExploreListWrapper>
  );
}
const DappExploreListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;