/* eslint-disable react/no-unescaped-entities */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-29 10:16:26
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useWlUserReact } from '@ecnft/wl-user-react';
import { useNavigate } from 'react-router-dom';
import ScrollBox from '../components/common/box/ScrollBox';
import Tab from '../components/common/tab/Tab';
import ContentList from '../components/contents/ContentList';
import EventExploreList from '../components/event/EventExploreList';
import EventLinkPreview from '../components/event/EventLinkPreview';
import { MainWrapper } from '../components/layout/Index';
import ProjectExploreList from '../components/project/ProjectExploreList';
import {
  ContentsEntityItem,
  EventsEntityItem,
  fetchUserGroupFavorites,
  ProjectsEntityItem,
  removeAllFavorites,
  selectState,
} from '../features/favorite/userGroupFavorites';
import useEventHandles from '../hooks/useEventHandles';
import useUserFavorites from '../hooks/useUserFavorites';
import ArchiveSvg from '../components/common/icons/svgs/archive.svg';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { AsyncRequestStatus } from '../services/types';
import Loading from '../components/common/loading/Loading';
import useProjectHandles from '../hooks/useProjectHandles';
import useContentHandles from '../hooks/useContentHandles';
import { ContentListItem } from '../services/types/contents';
import ProjectDetailView from '../components/project/ProjectDetailView';
import ContentShower from '../components/contents/ContentShower';
import { getContentWithJsonValue } from '../utils/content';
import {
  fetchCompletedEvents,
  fetchMoreEventCompletedList,
  removeAll as removeAllForCompletedEvents,
  selectAll as selectAllForCompletedEvents,
  selectState as selectStateForCompletedEvents,
} from '../features/event/eventCompletedList';
import TwoHeartSvg from '../components/imgs/two-heart.svg';
import CheckCircleSvg from '../components/imgs/check-circle.svg';
import { ButtonPrimaryLine } from '../components/common/button/ButtonBase';
import ListScrollBox from '../components/common/box/ListScrollBox';
import ContentShowerBox from '../components/contents/ContentShowerBox';

function EmptyFavorites() {
  const navigate = useNavigate();
  return (
    <EmptyFavoritesWrapper>
      <EmptyBox>
        <EmptyImg src={TwoHeartSvg} />
        <EmptyDesc>
          Nothing to see here！ Explore and favorite what you like！
        </EmptyDesc>
        <ButtonPrimaryLine onClick={() => navigate('/events')}>
          Explore
        </ButtonPrimaryLine>
      </EmptyBox>
    </EmptyFavoritesWrapper>
  );
}
function EmptyList() {
  return (
    <EmptyBox>
      <EmptyDesc>
        Nothing to see here！ Explore and favorite what you like！
      </EmptyDesc>
    </EmptyBox>
  );
}
function EmptyContent() {
  return (
    <EmptyBox>
      <EmptyImg src={TwoHeartSvg} />
    </EmptyBox>
  );
}
function EmptyCompletedEventList() {
  return (
    <EmptyBox>
      <EmptyDesc>
        It looks like you didn't do anything. Don't forget to mark completed
        events.
      </EmptyDesc>
    </EmptyBox>
  );
}
function EmptyCompletedEventContent() {
  return (
    <EmptyBox>
      <EmptyImg src={CheckCircleSvg} />
    </EmptyBox>
  );
}
const EmptyFavoritesWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #1b1e23;
`;
const EmptyBox = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  background-color: #1b1e23;
`;
const EmptyImg = styled.img`
  width: 100px;
  height: 100px;
`;
const EmptyDesc = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #748094;
`;

enum FavoriteSwitchValue {
  event = 'event',
  content = 'content',
  project = 'project',
  completeEvents = 'completeEvents',
}
export const FavoriteSwitchOptions = [
  {
    label: 'Event',
    value: FavoriteSwitchValue.event,
  },
  {
    label: 'Content',
    value: FavoriteSwitchValue.content,
  },
  {
    label: 'Project',
    value: FavoriteSwitchValue.project,
  },
];

function Favorites() {
  const { isLogin } = useWlUserReact();
  const dispatch = useAppDispatch();
  const completedEvents = useAppSelector(selectAllForCompletedEvents);
  const {
    status: completedStatus,
    moreStatus: completedMoreStatus,
    noMore: completedNoMore,
  } = useAppSelector(selectStateForCompletedEvents);
  const getMoreCompletedEvents = useCallback(
    () => dispatch(fetchMoreEventCompletedList()),
    []
  );
  const isLoadingMoreCompleted = useMemo(
    () => completedMoreStatus === AsyncRequestStatus.PENDING,
    [completedMoreStatus]
  );
  useEffect(() => {
    if (!isLogin) {
      dispatch(removeAllFavorites());
      dispatch(removeAllForCompletedEvents());
      return;
    }
    dispatch(fetchUserGroupFavorites());
    dispatch(fetchCompletedEvents());
  }, [isLogin]);
  const {
    favoredIds: eventFavoredIds,
    favorQueueIds: eventFavorQueueIds,
    completedIds: eventCompletedIds,
    completeQueueIds: eventCompleteQueueIds,
    onComplete: onEventComplete,
    onFavor: onEventFavor,
    onShare: onEventShare,
  } = useEventHandles();
  const {
    favoredIds: projectFavoredIds,
    favorQueueIds: projectFavorQueueIds,
    onFavor: onProjectFavor,
    onShare: onProjectShare,
  } = useProjectHandles();
  const {
    votedIds: contentVotedIds,
    voteQueueIds: contentVoteQueueIds,
    favorQueueIds: contentFavorQueueIds,
    hiddenQueueIds: contentHiddenQueueIds,
    onVote: onContentVote,
    onFavor: onContentFavor,
    onShare: onContentShare,
    onHidden: onContentHidden,
    formatCurrentContents,
  } = useContentHandles();

  const { events, projects, contents } = useUserFavorites();
  const { status } = useAppSelector(selectState);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const isEmptyEvents = useMemo(() => !events.length, [events]);
  const isEmptyProjects = useMemo(() => !projects.length, [projects]);
  const isEmptyContents = useMemo(() => !contents.length, [contents]);
  const isEmptyCompletedEvents = useMemo(
    () => !completedEvents.length,
    [completedEvents]
  );
  const isEmpty = useMemo(
    () => isEmptyEvents && isEmptyProjects && isEmptyContents,
    [isEmptyEvents, isEmptyProjects, isEmptyContents]
  );
  const [event, setEvent] = useState<EventsEntityItem | null>(null);
  const [completedEvent, setCompletedEvent] = useState<EventsEntityItem | null>(
    null
  );
  const [project, setProject] = useState<ProjectsEntityItem | null>(null);
  const [content, setContent] = useState<ContentsEntityItem | null>(null);
  const [switchValue, setSwitchValue] = useState<FavoriteSwitchValue>(
    FavoriteSwitchValue.event
  );

  const showProject = useMemo(
    () =>
      project
        ? {
            ...project,
            contents: formatCurrentContents(
              project.contents as ContentListItem[]
            ),
          }
        : null,
    [project, formatCurrentContents]
  );
  const showContentList = formatCurrentContents(contents);

  return (
    <FavoritesWrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <FavoritesLayout>
          {isEmpty ? (
            <EmptyFavorites />
          ) : (
            <>
              <FavoritesListBox>
                <FavoritesListHeader>
                  <TabSwitch
                    options={FavoriteSwitchOptions}
                    value={switchValue}
                    onChange={(value) => setSwitchValue(value)}
                  />
                  <HeaderLine />
                  <TabSwitch
                    options={[
                      {
                        label: <ArchiveIconButton src={ArchiveSvg} />,
                        value: FavoriteSwitchValue.completeEvents,
                      },
                    ]}
                    value={switchValue}
                    onChange={(value) => setSwitchValue(value)}
                  />
                </FavoritesListHeader>
                {switchValue === FavoriteSwitchValue.event &&
                  (isEmptyEvents ? (
                    <EmptyList />
                  ) : (
                    <FavoritesList>
                      <EventExploreList
                        data={events}
                        activeId={event?.id || 0}
                        favoredIds={eventFavoredIds}
                        favorQueueIds={eventFavorQueueIds}
                        completedIds={eventCompletedIds}
                        completeQueueIds={eventCompleteQueueIds}
                        displayHandles
                        onComplete={onEventComplete}
                        onFavor={onEventFavor}
                        onShare={onEventShare}
                        onItemClick={setEvent}
                      />
                    </FavoritesList>
                  ))}
                {switchValue === FavoriteSwitchValue.project &&
                  (isEmptyProjects ? (
                    <EmptyList />
                  ) : (
                    <FavoritesList>
                      <ProjectExploreList
                        data={projects}
                        activeId={project?.id || 0}
                        favoredIds={projectFavoredIds}
                        favorQueueIds={projectFavorQueueIds}
                        onFavor={onProjectFavor}
                        onShare={onProjectShare}
                        onItemClick={setProject}
                      />
                    </FavoritesList>
                  ))}
                {switchValue === FavoriteSwitchValue.content &&
                  (isEmptyContents ? (
                    <EmptyList />
                  ) : (
                    <FavoritesList>
                      <ContentList
                        data={showContentList}
                        activeId={content?.id}
                        loadingVoteIds={contentVoteQueueIds}
                        loadingFavorIds={contentFavorQueueIds}
                        loadingHiddenIds={contentHiddenQueueIds}
                        onVote={onContentVote}
                        onFavor={onContentFavor}
                        onShare={onContentShare}
                        onHidden={onContentHidden}
                        onItemClick={(item) =>
                          setContent(item as unknown as ContentListItem)
                        }
                      />
                    </FavoritesList>
                  ))}
                {switchValue === FavoriteSwitchValue.completeEvents &&
                  (isEmptyCompletedEvents ? (
                    <EmptyCompletedEventList />
                  ) : (
                    <ListScrollBox onScrollBottom={getMoreCompletedEvents}>
                      <EventExploreList
                        data={completedEvents}
                        activeId={completedEvent?.id || 0}
                        favoredIds={eventFavoredIds}
                        favorQueueIds={eventFavorQueueIds}
                        completedIds={eventCompletedIds}
                        completeQueueIds={eventCompleteQueueIds}
                        displayHandles
                        onComplete={onEventComplete}
                        onFavor={onEventFavor}
                        onShare={onEventShare}
                        onItemClick={setCompletedEvent}
                      />
                      {isLoadingMoreCompleted ? (
                        <MoreLoading>loading ...</MoreLoading>
                      ) : completedNoMore ? (
                        <MoreLoading>No other events</MoreLoading>
                      ) : null}
                    </ListScrollBox>
                  ))}
              </FavoritesListBox>
              <FavoritesContentBox>
                {FavoriteSwitchValue.event === switchValue &&
                  (event ? (
                    <EventLinkPreview data={event} />
                  ) : (
                    <EmptyContent />
                  ))}
                {FavoriteSwitchValue.completeEvents === switchValue &&
                  (completedEvent ? (
                    <EventLinkPreview data={completedEvent} />
                  ) : (
                    <EmptyCompletedEventContent />
                  ))}

                {switchValue === FavoriteSwitchValue.project &&
                  (project ? (
                    <ContentScrollBox>
                      {showProject && (
                        <ProjectDetailView
                          data={showProject}
                          eventCompletedIds={eventCompletedIds}
                          eventCompleteQueueIds={eventCompleteQueueIds}
                          onEventComplete={onEventComplete}
                          contentVotedIds={contentVotedIds}
                          onContentVote={onContentVote}
                        />
                      )}
                    </ContentScrollBox>
                  ) : (
                    <EmptyContent />
                  ))}

                {switchValue === FavoriteSwitchValue.content &&
                  (content ? (
                    <ContentShowerBox selectContent={content} />
                  ) : (
                    <EmptyContent />
                  ))}
              </FavoritesContentBox>
            </>
          )}
        </FavoritesLayout>
      )}
    </FavoritesWrapper>
  );
}
export default Favorites;

const FavoritesWrapper = styled(MainWrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const FavoritesLayout = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid #39424c;
  box-sizing: border-box;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
`;
const FavoritesListBox = styled.div`
  width: 360px;
  height: 100%;
  background: #1b1e23;
  border-right: 1px solid #39424c;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;
const FavoritesListHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  border-bottom: 1px solid #39424c;
  padding: 0 20px;
`;
const TabSwitch = styled(Tab)`
  border-bottom: none;
  justify-content: flex-start;
`;
const HeaderLine = styled.div`
  width: 1px;
  height: 10px;
  background: #718096;
`;
const ArchiveIconButton = styled.img`
  width: 24px;
  height: 24px;
`;
const FavoritesList = styled(ScrollBox)`
  width: 100%;
  height: 0px;
  flex: 1;
`;
const FavoritesContentBox = styled.div`
  width: 0;
  flex: 1;
  height: 100%;
`;
const ContentScrollBox = styled(ScrollBox)`
  width: 100%;
  height: 100%;
  padding: 20px;
`;
const MoreLoading = styled.div`
  padding: 20px;
  text-align: center;
  color: #748094;
`;
