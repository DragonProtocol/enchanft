/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-13 11:23:40
 * @Description: 首页任务看板
 */
import { AccountType, useWlUserReact } from '@ecnft/wl-user-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import CannotOpenPlatFormLink from '../components/event/CannotOpenPlatFormLink';
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

export default function Events() {
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
  const [filter, setFilter] = useState<EventExploreListFilterValues>(
    defaultEventExploreListFilterValues
  );
  const [event, setEvent] = useState<EventExploreListItemResponse | null>(null);
  useEffect(() => {
    dispatch(fetchEventExploreList({ ...filter }));
  }, [filter]);

  // 当此时选项发生变化，且orderby = foru, 且有绑定的evm账户信息变化时再重新请求一次
  useEffect(() => {
    if (evmAccount?.thirdpartyId && filter.orderBy === OrderBy.FORU) {
      dispatch(
        fetchEventExploreList({ ...filter, pubkey: evmAccount?.thirdpartyId })
      );
    }
  }, [filter, evmAccount]);

  const eventExploreList = useAppSelector(selectAll);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
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

  return (
    <EventsWrapper>
      <EventExploreListFilter
        values={filter}
        onChange={(newFilter) => setFilter(newFilter)}
      />
      <MainBox>
        <ListBox onScrollBottom={getMore}>
          {isLoading ? (
            <MoreLoading>loading ...</MoreLoading>
          ) : (
            <EventExploreList
              data={eventExploreList}
              activeId={event?.id || 0}
              favoredIds={favoredIds}
              favorQueueIds={favorQueueIds}
              completedIds={completedIds}
              displayHandles={isLogin}
              onComplete={onComplete}
              onFavor={onFavor}
              onShare={onShare}
              onItemClick={setEvent}
            />
          )}
          {!isLoading && isLoadingMore && (
            <MoreLoading>loading ...</MoreLoading>
          )}
        </ListBox>
        <ContentBox>
          {event ? (
            event.supportIframe ? (
              <EventIframe src={event.link} />
            ) : (
              <CannotOpenPlatFormLink
                iconUrl={event.platform.logo}
                linkUrl={event.link}
              />
            )
          ) : null}
        </ContentBox>
      </MainBox>
    </EventsWrapper>
  );
}
const EventsWrapper = styled(MainWrapper)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const MainBox = styled.div`
  width: 100%;
  height: 0px;
  border: 1px solid #39424c;
  box-sizing: border-box;
  border-radius: 20px;
  overflow: hidden;
  flex: 1;
  display: flex;
`;
const ListBox = styled(ListScrollBox)`
  width: 360px;
  height: 100%;

  background: #1b1e23;
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

const EventIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
