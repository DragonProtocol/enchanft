/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-23 15:50:14
 * @Description: file description
 */
import { useCallback } from 'react';
import styled from 'styled-components';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../animation/AnimatedListItem';
import ProjectExploreListItem, {
  ProjectExploreListItemData,
} from './ProjectExploreListItem';

export type ProjectExploreListProps = {
  data: ProjectExploreListItemData[];
  activeId: number;
  favoredIds?: number[];
  favorQueueIds: number[];
  displayHandles?: boolean;
  onFavor: (event: ProjectExploreListItemData) => void;
  onShare: (event: ProjectExploreListItemData) => void;
  onItemClick?: (item: ProjectExploreListItemData) => void;
};
export default function ProjectExploreList({
  data,
  activeId,
  favoredIds = [],
  favorQueueIds,
  displayHandles = true,
  onFavor,
  onShare,
  onItemClick,
}: ProjectExploreListProps) {
  const isFavored = useCallback(
    (item: ProjectExploreListItemData) =>
      item.favored || favoredIds.includes(item.id),
    [favoredIds]
  );
  const loadingFavor = useCallback(
    (id: number) => favorQueueIds.includes(id),
    [favorQueueIds]
  );
  const transitions = useAnimatedListTransition(data);
  return (
    <ProjectExploreListWrapper>
      {transitions((styles, item) => {
        return (
          <AnimatedListItem key={item.id} styles={{ ...styles }}>
            <ProjectExploreListItem
              data={item}
              isActive={item.id === activeId}
              onShare={() => onShare(item)}
              onFavor={() => onFavor(item)}
              displayHandles={displayHandles && item.id === activeId}
              isFavored={isFavored(item)}
              loadingFavor={loadingFavor(item.id)}
              disabledFavor={isFavored(item) || loadingFavor(item.id)}
              onClick={() => onItemClick && onItemClick(item)}
            />
          </AnimatedListItem>
        );
      })}
    </ProjectExploreListWrapper>
  );
}
const ProjectExploreListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
