/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-23 16:39:15
 * @Description: 首页任务看板
 */
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
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

enum FavoriteSwitchValue {
  event = 'event',
  content = 'content',
  project = 'project',
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
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserGroupFavorites());
  }, []);
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
  const [event, setEvent] = useState<EventsEntityItem | null>(null);
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
          <FavoritesListBox>
            <FavoritesListHeader>
              <TabSwitch
                options={FavoriteSwitchOptions}
                value={switchValue}
                onChange={(value) => setSwitchValue(value)}
              />
              <HeaderLine />
              <ArchiveIconButton src={ArchiveSvg} />
            </FavoritesListHeader>

            <FavoritesList>
              {switchValue === FavoriteSwitchValue.event && (
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
              )}
              {switchValue === FavoriteSwitchValue.project && (
                <ProjectExploreList
                  data={projects}
                  activeId={project?.id || 0}
                  favoredIds={projectFavoredIds}
                  favorQueueIds={projectFavorQueueIds}
                  onFavor={onProjectFavor}
                  onShare={onProjectShare}
                  onItemClick={setProject}
                />
              )}
              {switchValue === FavoriteSwitchValue.content && (
                <ContentList
                  data={showContentList}
                  activeId={content?.id || 0}
                  onVote={onContentVote}
                  onFavor={onContentFavor}
                  onShare={onContentShare}
                  onHidden={onContentHidden}
                  onItemClick={(item) =>
                    setContent(item as unknown as ContentListItem)
                  }
                />
              )}
            </FavoritesList>
          </FavoritesListBox>
          <FavoritesContentBox>
            {switchValue === FavoriteSwitchValue.event && event && (
              <EventLinkPreview data={event} />
            )}
            {switchValue === FavoriteSwitchValue.project && project && (
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
            )}
            {switchValue === FavoriteSwitchValue.content && content && (
              <ContentScrollBox>
                <ContentShower
                  {...content}
                  voteAction={() => {}}
                  favorsActions={() => {}}
                  hiddenAction={() => {}}
                  content={getContentWithJsonValue(content.value)}
                />
              </ContentScrollBox>
            )}
          </FavoritesContentBox>
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
