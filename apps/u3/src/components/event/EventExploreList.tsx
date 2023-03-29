/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-20 14:29:34
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
  onItemClick?: (item: EventExploreListItemData) => void;
};

export default function EventExploreList({
  data,
  activeId,
  onItemClick,
}: EventExploreListProps) {
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
              isActive={String(item.id || item.uuid) === String(activeId)}
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
