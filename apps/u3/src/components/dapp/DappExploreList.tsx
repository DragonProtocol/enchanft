/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 15:35:43
 * @Description: file description
 */
import { useCallback } from 'react';
import styled from 'styled-components';
import DappExploreListItem, {
  DappExploreListItemData,
} from './DappExploreListItem';

export type DappExploreListProps = {
  data: DappExploreListItemData[];
  installPendingIds: Array<string | number>;
  onInstall?: (item: DappExploreListItemData) => void;
  onOpen?: (item: DappExploreListItemData) => void;
  onItemClick?: (item: DappExploreListItemData) => void;
};
export default function DappExploreList({
  data,
  installPendingIds,
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
          <DappExploreListItem
            key={item.id}
            data={item}
            isInstalled={!!item?.favored}
            loadingInstall={loadingInstall(item.id)}
            disabledInstall={!!item?.favored || loadingInstall(item.id)}
            onInstall={() => onInstall && onInstall(item)}
            onOpen={() => onOpen && onOpen(item)}
            onClick={() => onItemClick && onItemClick(item)}
            displayButtons={!!item.url}
          />
        );
      })}
    </DappExploreListWrapper>
  );
}
const DappExploreListWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(calc((100% - 0px) / 3), 1fr));
  & > div {
    & {
      border-bottom: 1px solid rgba(57, 66, 76, 0.5);
      border-right: 1px solid rgba(57, 66, 76, 0.5);
    }
    &:nth-child(3n) {
      border-right: none;
    }
  }
`;
