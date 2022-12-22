/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-22 17:59:04
 * @Description: file description
 */
import { useCallback } from 'react';
import styled from 'styled-components';
import EventExploreListItem, {
  EventExploreListItemData,
} from './EventExploreListItem';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../animation/AnimatedListItem';

export type EventExploreListProps = {
  data: EventExploreListItemData[];
  activeId: number;
  favoredIds: number[];
  favorQueueIds: number[];
  completedIds: number[];
  displayHandles?: boolean;
  onComplete: (event: EventExploreListItemData) => void;
  onFavor: (event: EventExploreListItemData) => void;
  onShare: (event: EventExploreListItemData) => void;
  onItemClick?: (item: EventExploreListItemData) => void;
};

export default function EventExploreList({
  data,
  activeId,
  favoredIds,
  favorQueueIds,
  completedIds,
  displayHandles = true,
  onComplete,
  onFavor,
  onShare,
  onItemClick,
}: EventExploreListProps) {
  const isFavored = useCallback(
    (id: number) => favoredIds.includes(id),
    [favoredIds]
  );
  const loadingFavor = useCallback(
    (id: number) => favorQueueIds.includes(id),
    [favorQueueIds]
  );
  const isCompleted = useCallback(
    (id: number) => completedIds.includes(id),
    [completedIds]
  );
  const transitions = useAnimatedListTransition(data);

  return (
    <EventExploreListWrapper>
      {transitions((styles, item) => {
        return (
          <AnimatedListItem key={item.id} styles={{ ...styles }}>
            <EventExploreListItem
              data={item}
              isActive={item.id === activeId}
              onComplete={() => onComplete(item)}
              onShare={() => onShare(item)}
              onFavor={() => onFavor(item)}
              displayHandles={
                item.isDaylight ? false : displayHandles && item.id === activeId
              }
              isFavored={isFavored(item.id)}
              loadingFavor={loadingFavor(item.id)}
              disabledFavor={isFavored(item.id) || loadingFavor(item.id)}
              isCompleted={isCompleted(item.id)}
              disabledComplete={isCompleted(item.id)}
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
