/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-02 19:29:34
 * @Description: 首页任务看板
 */
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import EventExploreList from '../components/event/EventExploreList';
import ListRouteLayout from '../components/layout/ListRoutelLayout';
import {
  fetchEventExploreList,
  selectAll,
  selectState,
} from '../features/event/eventExploreList';
import { RouteKey } from '../route/routes';
import useRoute from '../route/useRoute';
import { AsyncRequestStatus } from '../services/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function Events() {
  const navigate = useNavigate();
  const { lastRouteMeta } = useRoute();
  const params = useParams();
  const activeId = Number(params.id);
  const { status } = useAppSelector(selectState);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchEventExploreList({}));
  }, []);

  const eventExploreList = useAppSelector(selectAll);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  return (
    <EventsWrapper>
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
    </EventsWrapper>
  );
}
const EventsWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
