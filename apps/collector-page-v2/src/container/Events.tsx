/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-06 18:56:24
 * @Description: 首页任务看板
 */
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import EventExploreList from '../components/event/EventExploreList';
import EventExploreListFilter, {
  defaultEventExploreListFilterValues,
  EventExploreListFilterValues,
} from '../components/event/EventExploreListFilter';
import {
  fetchEventExploreList,
  selectAll,
  selectState,
} from '../features/event/eventExploreList';
import { AsyncRequestStatus } from '../services/types';
import { EventExploreListItemResponse } from '../services/types/event';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Event from './Event';

export default function Events() {
  const params = useParams();
  const activeId = Number(params.id);
  const { status } = useAppSelector(selectState);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<EventExploreListFilterValues>(
    defaultEventExploreListFilterValues
  );
  const [event, setEvent] = useState<Maybe<EventExploreListItemResponse>>(null);
  useEffect(() => {
    dispatch(fetchEventExploreList(filter));
  }, [filter]);

  const eventExploreList = useAppSelector(selectAll);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  return (
    <EventsWrapper>
      <EventExploreListFilter
        values={filter}
        onChange={(newFilter) => setFilter(newFilter)}
      />
      <MainBox>
        <ListBox>
          {isLoading ? (
            <span>loading</span>
          ) : (
            <EventExploreList
              data={eventExploreList}
              activeId={activeId}
              onItemClick={setEvent}
            />
          )}
        </ListBox>
        <ContentBox>{event && <Event data={event} />}</ContentBox>
      </MainBox>
    </EventsWrapper>
  );
}
const EventsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const MainBox = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  gap: 20px;
`;
const ListBox = styled.div`
  width: 400px;
`;
const ContentBox = styled.div`
  flex: 1;
`;
