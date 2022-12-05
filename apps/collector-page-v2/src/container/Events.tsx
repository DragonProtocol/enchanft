/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-05 16:01:41
 * @Description: 首页任务看板
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import EventExploreList from '../components/event/EventExploreList';
import EventExploreListFilter, {
  defaultEventExploreListFilterValues,
  EventExploreListFilterValues,
} from '../components/event/EventExploreListFilter';
import ListRouteLayout from '../components/layout/ListRoutelLayout';
import {
  fetchEventExploreList,
  selectAll,
  selectState,
} from '../features/event/eventExploreList';
import { AsyncRequestStatus } from '../services/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function Events() {
  const navigate = useNavigate();
  const params = useParams();
  const activeId = Number(params.id);
  const { status } = useAppSelector(selectState);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<EventExploreListFilterValues>(
    defaultEventExploreListFilterValues
  );
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
      <EventsContentBox>
        {isLoading ? (
          <span>loading</span>
        ) : (
          <ListRouteLayout>
            <EventExploreList
              data={eventExploreList}
              activeId={activeId}
              onItemClick={(item) => navigate(`/events/${item.id}`)}
            />
          </ListRouteLayout>
        )}
      </EventsContentBox>
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
const EventsContentBox = styled.div`
  width: 100%;
  flex: 1;
`;
