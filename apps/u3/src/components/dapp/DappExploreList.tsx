/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 15:35:43
 * @Description: file description
 */
import { useCallback } from 'react';
import styled from 'styled-components';
import useUserFavorites from '../../hooks/useUserFavorites';
import DappExploreListItem, {
  DappExploreListItemData,
} from './DappExploreListItem';

export type DappExploreListProps = {
  data: DappExploreListItemData[];
  onFavorSuccess?: (item: DappExploreListItemData) => void;
  onOpen?: (item: DappExploreListItemData) => void;
  onItemClick?: (item: DappExploreListItemData) => void;
};
export default function DappExploreList({
  data,
  onFavorSuccess,
  onOpen,
  onItemClick,
}: DappExploreListProps) {
  const { isFavoredDapp, userFavoritesLoaded } = useUserFavorites();
  return (
    <DappExploreListWrapper>
      {data.map((item) => {
        return (
          <DappExploreListItem
            key={item.id}
            data={item}
            isInstalled={isFavoredDapp(item.threadStreamId)}
            onFavorSuccess={() => onFavorSuccess && onFavorSuccess(item)}
            onOpen={() => onOpen && onOpen(item)}
            onClick={() => onItemClick && onItemClick(item)}
            displayButtons={
              !!item.url && !!item.threadStreamId && userFavoritesLoaded
            }
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
