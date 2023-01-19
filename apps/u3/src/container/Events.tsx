/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-12 13:45:22
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  URLSearchParamsInit,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { usePermissions } from '@ecnft/wl-user-react';
import EventExploreList from '../components/event/EventExploreList';
import EventExploreListFilter, {
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
import { useAppDispatch, useAppSelector } from '../store/hooks';
import EventLinkPreview from '../components/event/EventLinkPreview';
import Loading from '../components/common/loading/Loading';
import NoResult from '../components/common/NoResult';
import FeedsMenu from '../components/layout/FeedsMenu';
import useAdminEventHandles from '../hooks/useAdminEventHandles';
import FeedsMenuRight, { Layout } from '../components/layout/FeedsMenuRight';
import FeedsFilterBox from '../components/layout/FeedsFilterBox';
import SearchInput from '../components/common/input/SearchInput';
import EventOrderBySelect, {
  defaultEventOrderBy,
} from '../components/event/EventOrderBySelect';
import EventExploreGridList from '../components/event/EventExploreGridList';
import EventPreviewModal from '../components/event/EventPreviewModal';
import {
  getEventsLayoutFromLocal,
  setContentsLayoutToLocal,
  setEventsLayoutToLocal,
} from '../utils/localLayout';

const filterValuesToSearchParams = (values: EventExploreListFilterValues) => {
  return {
    platforms: values.platforms.join(','),
    rewards: values.rewards.join(','),
    eventTypes: values.eventTypes.join(','),
    projectTypes: values.projectTypes.join(','),
  };
};
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
  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [activeId, setActiveId] = useState<string | number>('');
  const [layout, setLayout] = useState(getEventsLayoutFromLocal());
  const [openEventPreviewModal, setOpenEventPreviewModal] = useState(false);

  const currentSearchParams = useMemo(
    () => ({
      orderBy: searchParams.get('orderBy') || defaultEventOrderBy,
      platforms:
        searchParams.get('platform') || searchParams.get('platforms') || '',
      rewards: searchParams.get('reward') || searchParams.get('rewards') || '',
      eventTypes:
        searchParams.get('eventType') || searchParams.get('eventTypes') || '',
      projectTypes:
        searchParams.get('projectType') ||
        searchParams.get('projectTypes') ||
        '',
      keywords: searchParams.get('keywords') || '',
    }),
    [searchParams]
  );
  const filterValues = useMemo(
    () => ({
      platforms: currentSearchParams.platforms.split(','),
      rewards: currentSearchParams.rewards.split(','),
      eventTypes: currentSearchParams.eventTypes.split(','),
      projectTypes: currentSearchParams.projectTypes.split(','),
    }),
    [currentSearchParams]
  );
  useEffect(() => {
    const params = { ...currentSearchParams };
    if (id) {
      Object.assign(params, { eventId: Number(id) });
    }
    dispatch(fetchEventExploreList({ ...params }));
  }, [id, currentSearchParams]);
  const isInitActive = useRef(false);
  useEffect(() => {
    if (!isInitActive.current && status === AsyncRequestStatus.FULFILLED) {
      if (id) {
        setActiveId(id);
      } else {
        setActiveId(eventExploreList[0]?.id);
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
          ...currentSearchParams,
        })
      ),
    [currentSearchParams]
  );
  const isLoadingMore = useMemo(
    () => moreStatus === AsyncRequestStatus.PENDING,
    [moreStatus]
  );
  const isEmpty = useMemo(() => !eventExploreList.length, [eventExploreList]);

  const renderMoreLoading = useMemo(
    () =>
      isLoadingMore ? (
        <MoreLoading>loading ...</MoreLoading>
      ) : noMore ? (
        <MoreLoading>No other events</MoreLoading>
      ) : null,
    [isLoadingMore, noMore]
  );

  return (
    <EventsWrapper>
      <FeedsMenu
        rightEl={
          <FeedsMenuRight
            displayFilterButton
            isActiveFilter={isActiveFilter}
            onChangeActiveFilter={setIsActiveFilter}
            orderByEl={
              <EventOrderBySelect
                value={currentSearchParams.orderBy}
                onChange={(value) =>
                  setSearchParams({
                    ...currentSearchParams,
                    orderBy: value,
                  } as unknown as URLSearchParamsInit)
                }
              />
            }
            searchEl={
              <SearchInput
                onSearch={(value) =>
                  setSearchParams({
                    ...currentSearchParams,
                    keywords: value,
                  } as unknown as URLSearchParamsInit)
                }
              />
            }
            multiLayout
            layout={layout}
            setLayout={(l) => {
              setEventsLayoutToLocal(l);
              setLayout(l);
            }}
          />
        }
        bottomEl={
          <FeedsFilterBox open={isActiveFilter}>
            <EventExploreListFilter
              values={filterValues}
              onChange={(values) =>
                setSearchParams({
                  ...currentSearchParams,
                  ...filterValuesToSearchParams(values),
                })
              }
            />
          </FeedsFilterBox>
        }
      />

      <MainBox>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {layout === Layout.LIST && (
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

                      {renderMoreLoading}
                    </ListBox>
                    <ContentBox>
                      {event ? (
                        <EventLinkPreview
                          data={event}
                          showAdminOps={!event.isForU && isAdmin}
                          onAdminThumbUp={() => onAdminThumbUp(event)}
                          onAdminDelete={() => onAdminDelete(event)}
                          onAdminEdit={() =>
                            navigate(`/events/${event.id}/edit`)
                          }
                        />
                      ) : null}
                    </ContentBox>
                  </>
                ) : (
                  <NoResult />
                )}
              </MainBody>
            )}
            {layout === Layout.GRID && (
              <GrideListBox onScrollBottom={getMore}>
                <EventExploreGridList
                  data={eventExploreList}
                  onItemClick={(item) => {
                    setActiveId(item.id);
                    setOpenEventPreviewModal(true);
                  }}
                />

                {renderMoreLoading}
                <EventPreviewModal
                  isOpen={openEventPreviewModal}
                  data={event}
                  onComplete={() => {
                    onComplete(event);
                  }}
                  onShare={() => {
                    onShare(event);
                  }}
                  onFavor={() => {
                    onFavor(event);
                  }}
                  onClose={() => {
                    setActiveId('');
                    setOpenEventPreviewModal(false);
                  }}
                  isFavored={event?.favored}
                  loadingFavor={favorQueueIds.includes(event?.id)}
                  disabledFavor={favorQueueIds.includes(event?.id)}
                  isCompleted={event?.completed}
                  loadingComplete={completeQueueIds.includes(event?.id)}
                  disabledComplete={
                    completeQueueIds.includes(event?.id) || event?.completed
                  }
                  displayHandles={!event?.isForU}
                  showAdminOps={!event?.isForU && isAdmin}
                  onAdminThumbUp={() => onAdminThumbUp(event)}
                  onAdminDelete={() => onAdminDelete(event)}
                  onAdminEdit={() => navigate(`/events/${event?.id}/edit`)}
                />
              </GrideListBox>
            )}
          </>
        )}
      </MainBox>
    </EventsWrapper>
  );
}
const EventsWrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 0px;
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
const GrideListBox = styled(ListScrollBox)`
  width: 100%;
  height: 100%;
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
