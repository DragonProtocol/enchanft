/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-09 12:03:18
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePermissions } from '@ecnft/wl-user-react';
import EventExploreList from '../components/event/EventExploreList';
import EventExploreListFilter, {
  defaultEventExploreListFilterValues,
  EventExploreListFilterValues,
} from '../components/event/EventExploreListFilter';
import { MainWrapper } from '../components/layout/Index';
import ListScrollBox from '../components/common/box/ListScrollBox';
import {
  fetchEventExploreList,
  fetchMoreEventExploreList,
  selectAll,
  selectState,
} from '../features/event/eventExploreList';
import useEventHandles from '../hooks/useEventHandles';
import { AsyncRequestStatus } from '../services/types';
import { EventExploreListItemResponse } from '../services/types/event';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import EventLinkPreview from '../components/event/EventLinkPreview';
import Loading from '../components/common/loading/Loading';
import NoResult from '../components/common/NoResult';
import FeedsMenu from '../components/layout/FeedsMenu';
import useAdminEventHandles from '../hooks/useAdminEventHandles';

export default function Events() {
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    favoredIds,
    favorQueueIds,
    completedIds,
    completeQueueIds,
    onComplete,
    onFavor,
    onShare,
  } = useEventHandles();
  const { onAdminThumbUp, onAdminDelete } = useAdminEventHandles();
  const { status, moreStatus, noMore } = useAppSelector(selectState);
  const dispatch = useAppDispatch();
  const eventExploreList = useAppSelector(selectAll);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const [filter, setFilter] = useState<EventExploreListFilterValues>(
    defaultEventExploreListFilterValues
  );
  const [activeId, setActiveId] = useState<string | number>('');
  useEffect(() => {
    const params = {
      orderBy:
        searchParams.get('orderBy') ||
        defaultEventExploreListFilterValues.orderBy,
      platform:
        searchParams.get('platform') ||
        defaultEventExploreListFilterValues.platform,
      reward:
        searchParams.get('reward') ||
        defaultEventExploreListFilterValues.reward,
      projectType:
        searchParams.get('projectType') ||
        defaultEventExploreListFilterValues.projectType,
      keywords:
        searchParams.get('keywords') ||
        defaultEventExploreListFilterValues.keywords,
    } as EventExploreListFilterValues;
    setFilter(params);
  }, [searchParams]);
  useEffect(() => {
    const params = { ...filter };
    if (id) {
      Object.assign(params, { eventId: Number(id) });
    }
    dispatch(fetchEventExploreList({ ...params }));
  }, [id, filter]);
  const isInitActive = useRef(false);
  useEffect(() => {
    if (!isInitActive.current && status === AsyncRequestStatus.FULFILLED) {
      if (id) {
        setActiveId(id);
      } else {
        setActiveId(eventExploreList[0].id);
      }
      isInitActive.current = true;
    }
  }, [id, eventExploreList, status]);

  const event = useMemo(
    () => eventExploreList.find((item) => String(item.id) === String(activeId)),
    [eventExploreList, activeId]
  );

  const getMore = useCallback(
    () =>
      dispatch(
        fetchMoreEventExploreList({
          ...filter,
        })
      ),
    [filter]
  );
  const isLoadingMore = useMemo(
    () => moreStatus === AsyncRequestStatus.PENDING,
    [moreStatus]
  );
  const isEmpty = useMemo(() => !eventExploreList.length, [eventExploreList]);
  return (
    <EventsWrapper>
      <FeedsMenu
        right={
          <EventExploreListFilter
            values={filter}
            onChange={(newFilter) => setSearchParams(newFilter)}
          />
        }
      />

      <MainBox>
        {isLoading ? (
          <Loading />
        ) : (
          <MainBody>
            {!isEmpty ? (
              <>
                <ListBox onScrollBottom={getMore}>
                  <EventExploreList
                    data={eventExploreList}
                    activeId={event?.id || 0}
                    favoredIds={favoredIds}
                    favorQueueIds={favorQueueIds}
                    completedIds={completedIds}
                    completeQueueIds={completeQueueIds}
                    onComplete={onComplete}
                    onFavor={onFavor}
                    onShare={onShare}
                    onItemClick={(item) => setActiveId(item.id)}
                  />
                  {isLoadingMore ? (
                    <MoreLoading>loading ...</MoreLoading>
                  ) : noMore ? (
                    <MoreLoading>No other events</MoreLoading>
                  ) : null}
                </ListBox>
                <ContentBox>
                  {event ? (
                    <EventLinkPreview
                      data={event}
                      showAdminOps={!event.isForU && isAdmin}
                      onAdminThumbUp={() => onAdminThumbUp(event)}
                      onAdminDelete={() => onAdminDelete(event)}
                      onAdminEdit={() => navigate(`/events/${event.id}/edit`)}
                    />
                  ) : null}
                </ContentBox>
              </>
            ) : (
              <NoResult />
            )}
          </MainBody>
        )}
      </MainBox>
    </EventsWrapper>
  );
}
const EventsWrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const MainBox = styled.div`
  width: 100%;
  height: 0px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const MainBody = styled.div`
  width: 100%;
  height: 100%;
  background: #1b1e23;
  border: 1px solid #39424c;
  box-sizing: border-box;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
`;
const ListBox = styled(ListScrollBox)`
  width: 360px;
  height: 100%;
  border-right: 1px solid #39424c;
  box-sizing: border-box;
  overflow-y: auto;
`;
const MoreLoading = styled.div`
  padding: 20px;
  text-align: center;
  color: #748094;
`;
const ContentBox = styled.div`
  width: 0;
  flex: 1;
  height: 100%;
`;
