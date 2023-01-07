/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-27 14:12:36
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
import { useGAEvent } from '../../hooks/useGoogleAnalytics';

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
  const gaEvent = useGAEvent('u3-event');
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
                gaEvent('completeEvent', item.name);
              }}
              onShare={() => {
                onShare(item);
                gaEvent('shareEvent', item.name);
              }}
              onFavor={() => {
                onFavor(item);
                gaEvent('favorEvent', item.name);
              }}
              displayHandles={
                item.isDaylight ? false : displayHandles && item.id === activeId
              }
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
