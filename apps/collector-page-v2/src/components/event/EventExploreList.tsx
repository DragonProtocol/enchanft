/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-08 15:09:09
 * @Description: file description
 */
import styled from 'styled-components';
import { EventExploreListItemResponse } from '../../services/types/event';
import EventExploreListItem from './EventExploreListItem';

export type EventExploreListProps = {
  data: EventExploreListItemResponse[];
  activeId: number;
  onItemClick?: (item: EventExploreListItemResponse) => void;
};
export default function EventExploreList({
  data,
  activeId,
  onItemClick,
}: EventExploreListProps) {
  return (
    <EventExploreListWrapper>
      {data.map((item) => (
        <EventExploreListItem
          key={item.id}
          data={item}
          isActive={item.id === activeId}
          onClick={() => onItemClick && onItemClick(item)}
        />
      ))}
    </EventExploreListWrapper>
  );
}
const EventExploreListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
