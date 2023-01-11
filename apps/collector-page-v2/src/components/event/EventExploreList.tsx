/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-11 17:28:21
 * @Description: file description
 */
import { useCallback } from 'react';
import styled from 'styled-components';
import EventExploreListItem, {
  EventExploreListItemData,
  styleMaps,
} from './EventExploreListItem';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../animation/AnimatedListItem';

export type EventExploreListProps = {
  data: EventExploreListItemData[];
  activeId: number | string;
  favorQueueIds: Array<number | string>;
  favoredIds?: Array<number | string>;
  completeQueueIds: Array<number | string>;
  completedIds?: Array<number | string>;
  displayHandles?: boolean;
  onComplete: (event: EventExploreListItemData) => void;
  onFavor: (event: EventExploreListItemData) => void;
  onShare: (event: EventExploreListItemData) => void;
  onItemClick?: (item: EventExploreListItemData) => void;
};

export default function EventExploreList({
  data,
  activeId,
  favorQueueIds,
  favoredIds = [],
  completeQueueIds,
  completedIds = [],
  displayHandles = true,
  onComplete,
  onFavor,
  onShare,
  onItemClick,
}: EventExploreListProps) {
  const isFavored = useCallback(
    (item: EventExploreListItemData) =>
      item.favored || favoredIds.includes(item.id),
    [favoredIds]
  );
  const loadingFavor = useCallback(
    (id: number | string) => favorQueueIds.includes(id),
    [favorQueueIds]
  );
  const isCompleted = useCallback(
    (item: EventExploreListItemData) =>
      item.completed || completedIds.includes(item.id),
    [completedIds]
  );
  const loadingComplete = useCallback(
    (id: number | string) => completeQueueIds.includes(id),
    [completeQueueIds]
  );
  const transitions = useAnimatedListTransition(data);
  return (
    <EventExploreListWrapper>
      {transitions((styles, item) => {
        const bgc = styleMaps[item?.platform?.name]?.bgc;
        return (
          <AnimatedListItem
            key={item.id}
            styles={{ ...styles }}
            bottomFaceBgc={bgc}
          >
            <EventExploreListItem
              data={item}
              isActive={item.id === activeId}
              onComplete={() => {
                onComplete(item);
              }}
              onShare={() => {
                onShare(item);
              }}
              onFavor={() => {
                onFavor(item);
              }}
              displayHandles={displayHandles && item.id === activeId}
              isFavored={isFavored(item)}
              loadingFavor={loadingFavor(item.id)}
              disabledFavor={isFavored(item) || loadingFavor(item.id)}
              isCompleted={isCompleted(item)}
              loadingComplete={loadingComplete(item.id)}
              disabledComplete={isCompleted(item) || loadingComplete(item.id)}
              onClick={() => onItemClick && onItemClick(item)}
            />
          </AnimatedListItem>
        );
      })}
    </EventExploreListWrapper>
  );
}
const EventExploreListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
