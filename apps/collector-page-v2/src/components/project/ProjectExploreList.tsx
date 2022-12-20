/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-20 14:32:01
 * @Description: file description
 */
import { useCallback } from 'react';
import styled from 'styled-components';
import ProjectExploreListItem, {
  ProjectExploreListItemData,
} from './ProjectExploreListItem';

export type ProjectExploreListProps = {
  data: ProjectExploreListItemData[];
  activeId: number;
  favoredIds: number[];
  favorQueueIds: number[];
  displayHandles?: boolean;
  onFavor: (event: ProjectExploreListItemData) => void;
  onShare: (event: ProjectExploreListItemData) => void;
  onItemClick?: (item: ProjectExploreListItemData) => void;
};
export default function ProjectExploreList({
  data,
  activeId,
  favoredIds,
  favorQueueIds,
  displayHandles = true,
  onFavor,
  onShare,
  onItemClick,
}: ProjectExploreListProps) {
  const isFavored = useCallback(
    (id: number) => favoredIds.includes(id),
    [favoredIds]
  );
  const loadingFavor = useCallback(
    (id: number) => favorQueueIds.includes(id),
    [favorQueueIds]
  );
  return (
    <ProjectExploreListWrapper>
      {data.map((item) => (
        <ProjectExploreListItem
          key={item.id}
          data={item}
          isActive={item.id === activeId}
          onShare={() => onShare(item)}
          onFavor={() => onFavor(item)}
          displayHandles={displayHandles && item.id === activeId}
          isFavored={isFavored(item.id)}
          loadingFavor={loadingFavor(item.id)}
          disabledFavor={isFavored(item.id) || loadingFavor(item.id)}
          onClick={() => onItemClick && onItemClick(item)}
        />
      ))}
    </ProjectExploreListWrapper>
  );
}
const ProjectExploreListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
