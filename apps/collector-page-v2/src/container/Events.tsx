/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-19 17:23:01
 * @Description: 首页任务看板
 */
import { AccountType, useWlUserReact } from '@ecnft/wl-user-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useParams, useSearchParams } from 'react-router-dom';
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
import { OrderBy } from '../services/types/common';
import { EventExploreListItemResponse } from '../services/types/event';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import EventLinkPreview from '../components/event/EventLinkPreview';
import Loading from '../components/common/loading/Loading';

export default function Events() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    favoredIds,
    favorQueueIds,
    completedIds,
    onComplete,
    onFavor,
    onShare,
  } = useEventHandles();
  const { getBindAccount, isLogin } = useWlUserReact();
  const evmAccount = getBindAccount(AccountType.EVM);
  const { status, moreStatus } = useAppSelector(selectState);
  const dispatch = useAppDispatch();
  const eventExploreList = useAppSelector(selectAll);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const [filter, setFilter] = useState<EventExploreListFilterValues>(
    defaultEventExploreListFilterValues
  );
  const [event, setEvent] = useState<EventExploreListItemResponse | null>(null);
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
    if (evmAccount?.thirdpartyId && filter.orderBy === OrderBy.FORU) {
      Object.assign(params, { pubkey: evmAccount?.thirdpartyId });
    }
    dispatch(fetchEventExploreList({ ...params }));
  }, [id, filter, evmAccount]);
  useEffect(() => {
    if (id) {
      setEvent(eventExploreList.find((item) => item.id === Number(id)));
    } else {
      setEvent(eventExploreList[0]);
    }
  }, [eventExploreList, id]);

  const getMore = useCallback(
    () =>
      dispatch(
        fetchMoreEventExploreList({
          ...filter,
          pubkey: evmAccount?.thirdpartyId,
        })
      ),
    [filter, evmAccount]
  );
  const isLoadingMore = useMemo(
    () => moreStatus === AsyncRequestStatus.PENDING,
    [moreStatus]
  );
  const isEmpty = useMemo(() => !eventExploreList.length, [eventExploreList]);
  return (
    <EventsWrapper>
      <EventExploreListFilter
        values={filter}
        onChange={(newFilter) => setSearchParams(newFilter)}
      />
      <MainBox>
        {isLoading ? (
          <Loading />
        ) : (
          !isEmpty && (
            <MainBody>
              <ListBox onScrollBottom={getMore}>
                <EventExploreList
                  data={eventExploreList}
                  activeId={event?.id || 0}
                  favoredIds={favoredIds}
                  favorQueueIds={favorQueueIds}
                  completedIds={completedIds}
                  onComplete={onComplete}
                  onFavor={onFavor}
                  onShare={onShare}
                  onItemClick={setEvent}
                />
                {isLoadingMore && <MoreLoading>loading ...</MoreLoading>}
              </ListBox>
              <ContentBox>
                {event ? <EventLinkPreview data={event} /> : null}
              </ContentBox>
            </MainBody>
          )
        )}
      </MainBox>
    </EventsWrapper>
  );
}
const EventsWrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
