/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-23 12:09:23
 * @Description: file description
 */
import { useCallback } from 'react';
import styled from 'styled-components';
import DappExploreListItem, {
  DappExploreListItemData,
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
          <DappExploreListItem
            key={item.id}
            data={item}
            // isInstalled={!!item?.favored}
            // loadingInstall={loadingInstall(item.id)}
            // disabledInstall={!!item?.favored || loadingInstall(item.id)}
            // onInstall={() => onInstall && onInstall(item)}
            // onOpen={() => onOpen && onOpen(item)}
            onClick={() => onItemClick && onItemClick(item)}
            // displayButtons={!!item.dappUrl}
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
  gap: 20px;
  & > div {
    & {
      border: 1px solid rgba(57, 66, 76, 0.5);
      border-right: 1px solid rgba(57, 66, 76, 0.5);
    }
  }
`;
